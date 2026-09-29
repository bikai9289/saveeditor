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

## Indexing Helpers

```bash
npm run index:urls
```

This prints only the currently published RPG Maker-scope URLs.
