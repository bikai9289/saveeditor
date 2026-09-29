const host = (process.env.PUBLIC_SITE_ORIGIN || 'https://saveeditor.top').replace(/\/+$/, '');

const urls = [
    '/',
    '/llms.txt',
    '/llms-full.txt',
    '/editor/rpg-maker-mv',
    '/about',
    '/faq',
    '/support',
    '/contact',
    '/privacy',
    '/terms',
    '/cookie-policy',
];

for (const url of urls) {
    console.log(`${host}${url}`);
}
