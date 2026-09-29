# Follow-up cleanup report

Date: 2026-09-29

## Source document

This pass followed the second audit note that flagged the added `LICENSE`, public support
overclaims, and two inherited crawler/cache settings.

## Fixes completed

| Audit item | Action taken | Status |
| --- | --- | --- |
| Added MIT license could imply upstream authorization | Removed `LICENSE`; docs now treat upstream permission as a release blocker | Done |
| `robots.txt` blocked `/_astro/` | Removed `Disallow: /_astro/` so crawlers can fetch built JS/CSS assets | Done |
| Service worker cached `/` cache-first | Removed `/` from `STATIC_ASSETS`; static assets such as favicon, manifest, and `llms.txt` remain cached | Done |
| Public FAQ claimed six RPG Maker extensions | Public FAQ now says tested public support currently covers `.rmmzsave`; other RPG Maker extensions require real-save verification before being added | Done |
| Other public pages still claimed broad RPG Maker formats | Home, About, editor metadata, README, and LLM docs were narrowed to tested RPG Maker MZ `.rmmzsave` scope | Done |
| Public entry still accepted broader extensions | Home file chooser, editor accept string, ingest validation, and home script validation now accept `.rmmzsave` only | Done |
| Candidate fields looked like verified fields | Editor UI now labels gold as tested and actor/inventory/variable/switch fields as candidate fields requiring in-game verification | Done |
| `hreflang` duplicated the single English URL | Removed alternate hreflang output from `BaseLayout.astro` | Done |
| CSP included `unsafe-eval` | Removed `unsafe-eval` from `script-src` | Done |
| Default OG image pointed into removed blog area | Changed default OG image to `/images/games/rpg-maker.webp` | Done |
| Public 50MB claim was inherited and unverified | Public copy and enforced editor limit now use 10MB | Done |
| Dead i18n keys for blog/game/cookie pages | Removed unused `nav.blog`, `home.blog.*`, `blog.*`, `gamesPage.*`, and `cookie.*` keys | Done |

## Remaining blocker

The repository is still publicly marked as forked from `paradoxie/saveeditor`. No local code change
can prove upstream authorization. Before public/commercial launch, complete one of these:

- obtain explicit upstream license/permission and keep evidence with the project records;
- replace inherited upstream code with original implementation.

Until that is resolved, licensing remains the main release blocker.
