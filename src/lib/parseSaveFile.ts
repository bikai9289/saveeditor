import { makeOutcome, type FormatFamily, type ParseOutcome } from './parsers/types';
import { attachSupportPack, buildSupportPack } from './supportPack';

export interface ParsedSaveFileResult<TData = unknown> {
    outcome: ParseOutcome<TData>;
    parserPath: string;
    uiFormat: string;
}

const RPG_MAKER_EXTENSIONS = new Set(['rpgsave', 'rmmzsave', 'rvdata2', 'rvdata', 'rxdata', 'lsd']);
const PUBLIC_RPG_MAKER_MZ_EDITOR = 'rpg-maker-mz';

const loadParsers = {
    rpgmaker: () => import('./parsers/rpgmaker').then((mod) => mod.parseRPGMakerMV),
};

export async function parseSaveFile(file: File, editorSlug = ''): Promise<ParsedSaveFileResult<any>> {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    let outcome: ParseOutcome<any>;
    let parserPath = inferParserPath(file, editorSlug);

    if (editorSlug === PUBLIC_RPG_MAKER_MZ_EDITOR && ext !== 'rmmzsave') {
        parserPath = 'unsupported';
        outcome = makeOutcome({
            engine: 'generic',
            format: ext ? `.${ext}` : 'unknown',
            formatFamily: 'generic-binary',
            mode: 'error',
            reasonCode: 'unsupported_extension',
            reason: 'This public editor currently supports tested RPG Maker MZ .rmmzsave files only.',
            capabilities: {
                canView: false,
                canEdit: false,
                canSave: false,
                roundTripSupport: 'none',
            },
            data: null,
        });
    } else if (RPG_MAKER_EXTENSIONS.has(ext)) {
        outcome = await (await loadParsers.rpgmaker())(file);
    } else {
        parserPath = 'unsupported';
        outcome = makeOutcome({
            engine: 'generic',
            format: ext ? `.${ext}` : 'unknown',
            formatFamily: 'generic-binary',
            mode: 'error',
            reasonCode: 'unsupported_extension',
            reason: 'This public editor currently supports RPG Maker save files only.',
            capabilities: {
                canView: false,
                canEdit: false,
                canSave: false,
                roundTripSupport: 'none',
            },
            data: null,
        });
    }

    const normalizedOutcome = ensureFormatFamily(await attachSupportPack(outcome, file, parserPath));
    return {
        outcome: normalizedOutcome,
        parserPath,
        uiFormat: resolveUiFormat(normalizedOutcome, editorSlug),
    };
}

export async function parseSaveFileSafe(file: File, editorSlug = ''): Promise<ParsedSaveFileResult<any>> {
    try {
        return await parseSaveFile(file, editorSlug);
    } catch (error: any) {
        const ext = file.name.split('.').pop()?.toLowerCase();
        const parserPath = inferParserPath(file, editorSlug);
        const fallbackOutcome = makeOutcome({
            engine: 'generic',
            format: ext ? `.${ext}` : 'unknown',
            formatFamily: inferFormatFamily('generic', ext ? `.${ext}` : 'unknown'),
            mode: 'error',
            reasonCode: 'parse_failed',
            reason: error?.message || 'Parser threw before returning a structured outcome.',
            capabilities: {
                canView: false,
                canEdit: false,
                canSave: false,
                roundTripSupport: 'none',
            },
            data: null,
        });
        const headerBytes = new Uint8Array(await file.slice(0, 512).arrayBuffer());
        const outcomeWithPack = {
            ...fallbackOutcome,
            diagnostics: {
                ...(fallbackOutcome.diagnostics || {}),
                supportPack: buildSupportPack(fallbackOutcome, file, parserPath, 'exception', headerBytes),
            },
        };
        return {
            outcome: outcomeWithPack,
            parserPath,
            uiFormat: ext ? `.${ext}` : 'unknown',
        };
    }
}

export function inferParserPath(file: Pick<File, 'name'>, editorSlug = ''): string {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (RPG_MAKER_EXTENSIONS.has(ext)) return 'rpgmaker';
    return editorSlug ? `${editorSlug}-unsupported` : 'unsupported';
}

export function getComparableData(outcome: ParseOutcome<any>): unknown {
    if (!outcome.capabilities.canView) return null;
    return outcome.data;
}

function resolveUiFormat(outcome: ParseOutcome<any>, editorSlug: string): string {
    if (outcome.format === 'rpgmaker-ruby-marshal' || outcome.format === 'rpgmaker-2000-2003-lsd') {
        return outcome.format;
    }
    if (outcome.engine === 'rpgmaker') return 'rpgmaker';
    return outcome.format;
}

function ensureFormatFamily<TData>(outcome: ParseOutcome<TData>): ParseOutcome<TData> {
    if (outcome.formatFamily) return outcome;
    return {
        ...outcome,
        formatFamily: inferFormatFamily(outcome.engine, outcome.format),
    };
}

function inferFormatFamily(engine: ParseOutcome['engine'], format: string): FormatFamily {
    if (engine === 'rpgmaker') return 'rpgmaker';
    return format.startsWith('generic-structured') ? 'generic-structured' : 'generic-binary';
}
