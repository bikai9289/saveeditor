import { localizePath, normalizeLang } from '../i18n/utils';
import { SITE_ORIGIN } from './site';
import { createUploadTicket, type UploadTicket } from './upload-vault';

const PUBLIC_RPG_MAKER_EXTENSIONS = new Set(['.rmmzsave']);

function getExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf('.');
    return lastDot === -1 ? '' : fileName.slice(lastDot).toLowerCase();
}

export function isRpgMakerSaveFile(fileName: string): boolean {
    return PUBLIC_RPG_MAKER_EXTENSIONS.has(getExtension(fileName));
}

export function buildEditorUrl(token: string, locale?: string | null): string {
    const lang = normalizeLang(locale);
    const base = localizePath('/editor/rpg-maker-mz', lang);
    const url = new URL(base, SITE_ORIGIN);
    url.searchParams.set('fileToken', token);
    return `${url.pathname}${url.search}`;
}

export function appendUploadToken(route: string, token?: string | null): string {
    if (!token) return route;
    const url = new URL(route, SITE_ORIGIN);
    url.searchParams.set('fileToken', token);
    return `${url.pathname}${url.search}`;
}

export function readUploadToken(search: string): string | null {
    const params = new URLSearchParams(search);
    return params.get('fileToken') || params.get('uploadToken');
}

export async function beginEditorFlow(
    file: File,
    options: { locale?: string | null; source: string }
): Promise<{ ticket: UploadTicket; url: string }> {
    if (!isRpgMakerSaveFile(file.name)) {
        throw new Error('This public editor currently accepts tested RPG Maker MZ .rmmzsave files only.');
    }
    const ticket = await createUploadTicket(file, options);
    return {
        ticket,
        url: buildEditorUrl(ticket.token, ticket.locale),
    };
}
