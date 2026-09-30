# Editor safety follow-up

Date: 2026-09-30

## Scope

This pass addressed the three deployment checks raised for the public RPG Maker MZ editor:

1. The rejected-file support mailto was checked for save-data leakage.
2. The browser-only privacy wording was made consistent.
3. The public MZ route was prevented from reaching legacy RPG Maker parser branches.

## Findings and changes

| Check | Source evidence | Change | Status |
| --- | --- | --- | --- |
| Support email content | `supportPack.ts` only serializes a redacted filename, extension, size bucket, parser state, capability flags, content class, byte hash, schema fingerprint, and bounded structure counts. It does not serialize `data` or raw bytes. | Added a visible note beside the support link: email contains metadata and signatures only, never save contents. | Done |
| Privacy wording | The editor error advice used a narrower `does not upload save contents to a server` phrase. | Unified it to `Nothing is uploaded. Everything happens in your browser.` with the backup reminder. | Done |
| Public format boundary | `parseSaveFile` previously sent `.rpgsave`, `.rvdata*`, and `.lsd` files through the parser when called by the MZ route. | The `rpg-maker-mz` route now rejects every extension except `.rmmzsave` before loading a parser. | Done |
| Legacy UI branches | The MZ shell treated Ruby Marshal and LSD formats as displayable editor formats. | The public MZ shell now selects the RPG Maker editor only for the verified `rpgmaker` format. | Done |

## Regression checks

Added `scripts/verify-editor-safety.ts` and included it in `npm test`.

- A `.rpgsave` file passed to the public MZ route returns `unsupported_extension`, with viewing disabled.
- A support pack built from data containing a sentinel private value does not include that value in the generated mailto.
- `npm.cmd test` passed: Astro build completed and `Editor safety checks passed.` was printed.

## Boundary

The checks use synthetic files and source-level support-pack construction. They do not prove compatibility with a real RPG Maker MZ save or validate a deployed Cloudflare Pages environment. Real-save round-trip testing and deployment verification remain separate release checks.
