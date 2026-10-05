# SaveFileTool

Browser-based RPG Maker MZ `.rmmzsave` and MV `.rpgsave` editing.

The public site offers separate MZ and MV editors, each restricted to its published extension.

## Published Scope

- RPG Maker MZ: `.rmmzsave`
- RPG Maker MV: `.rpgsave`; gold editing verified in an official MV 1.6.1 trial project (1234 to 98765, loaded in game). Third-party MV games and custom plugins are not covered by that evidence.

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
