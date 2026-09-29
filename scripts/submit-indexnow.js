import https from 'https';

const origin = new URL(process.env.PUBLIC_SITE_ORIGIN || 'https://savefiletool.com');
const host = origin.hostname;
const base = origin.origin;
const key = process.env.INDEXNOW_KEY;
if (!key) throw new Error('INDEXNOW_KEY is required.');
const keyLocation = `${base}/${key}.txt`;

const urlList = [
    `${base}/`,
    `${base}/sitemap-index.xml`,
    `${base}/llms.txt`,
    `${base}/llms-full.txt`,
    `${base}/editor/rpg-maker-mz`,
    `${base}/about`,
    `${base}/faq`,
    `${base}/support`,
    `${base}/contact`,
    `${base}/privacy`,
    `${base}/terms`,
    `${base}/cookie-policy`,
];

const data = JSON.stringify({
    host,
    key,
    keyLocation,
    urlList,
});

const options = {
    hostname: 'api.indexnow.org',
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': data.length,
    },
};

const req = https.request(options, (res) => {
    console.log(`IndexNow Status Code: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
console.log('Submitting URLs to IndexNow...');
