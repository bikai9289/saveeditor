# SaveFileTool

Browser-based RPG Maker MZ save editing for tested local `.rmmzsave` files.

The public site is intentionally scoped to a tested RPG Maker MZ `.rmmzsave` entry. It does not present itself as a universal save editor.

## Published Scope

- RPG Maker MZ: `.rmmzsave`

Other RPG Maker extensions are not part of the public support promise until verified with real save files.

Files are selected and processed in the browser. Always keep the original backup before replacing a save file in game.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production build prerenders the public RPG Maker editor, FAQ, support, and legal pages.

## Contact Email

The contact form sends through Resend from the server-side Cloudflare route `/api/contact`; it does not require a mail client on the visitor's device. Configure `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `SUPPORT_EMAIL` as Cloudflare secrets or environment variables before deployment. The sender domain must be verified in Resend.

## Indexing Helpers

```bash
npm run index:urls
```

This prints only the currently published RPG Maker-scope URLs.
