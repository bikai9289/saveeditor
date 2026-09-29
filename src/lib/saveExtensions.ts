export const SMART_UPLOAD_EXTENSIONS = [
    'rmmzsave',
];

export const SMART_UPLOAD_ACCEPT = Array.from(new Set(SMART_UPLOAD_EXTENSIONS)).map((ext) => `.${ext}`).join(',');
