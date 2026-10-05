export const PUBLIC_RPG_MAKER_EDITORS: Record<string, { extension: string; name: string }> = {
    'rpg-maker-mz': { extension: 'rmmzsave', name: 'RPG Maker MZ' },
    'rpg-maker-mv': { extension: 'rpgsave', name: 'RPG Maker MV' },
};

export const SMART_UPLOAD_EXTENSIONS = Object.values(PUBLIC_RPG_MAKER_EDITORS).map(editor => editor.extension);

export const SMART_UPLOAD_ACCEPT = Array.from(new Set(SMART_UPLOAD_EXTENSIONS)).map((ext) => `.${ext}`).join(',');
