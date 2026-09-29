# SaveFileTool

Browser-based RPG Maker save editing for compatible local save files.

The public site is intentionally scoped to RPG Maker formats. It does not present itself as a universal save editor.

## Published Scope

- RPG Maker MV/MZ: `.rpgsave`, `.rmmzsave`
- RPG Maker XP/VX/VX Ace: `.rvdata2`, `.rvdata`, `.rxdata`
- RPG Maker 2000/2003: `.lsd`

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
