import { localizePath, normalizeLang } from '../i18n/utils';
import { SITE_ORIGIN } from './site';
import { createUploadTicket, type UploadTicket } from './upload-vault';
import { PUBLIC_RPG_MAKER_EDITORS, SMART_UPLOAD_EXTENSIONS } from './saveExtensions';

const PUBLIC_RPG_MAKER_EXTENSIONS = new Set(SMART_UPLOAD_EXTENSIONS.map(ext => `.${ext}`));

function getExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf('.');
    return lastDot === -1 ? '' : fileName.slice(lastDot).toLowerCase();
}

export function isRpgMakerSaveFile(fileName: string): boolean {
    return PUBLIC_RPG_MAKER_EXTENSIONS.has(getExtension(fileName));
}

export function buildEditorUrl(token: string, locale?: string | null, fileName = 'file.rmmzsave'): string {
    const lang = normalizeLang(locale);
    const slug = Object.entries(PUBLIC_RPG_MAKER_EDITORS).find(([, editor]) => `.${editor.extension}` === getExtension(fileName))?.[0];
    if (!slug) throw new Error('No published editor supports this save format.');
    const base = localizePath(`/editor/${slug}`, lang);
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
        throw new Error('Choose an RPG Maker MV .rpgsave or MZ .rmmzsave file.');
    }
    const ticket = await createUploadTicket(file, options);
    return {
        ticket,
        url: buildEditorUrl(ticket.token, ticket.locale, file.name),
    };
}
