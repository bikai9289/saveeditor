# SaveFileTool cleanup repair report

Date: 2026-09-29

## Scope

This repair pass addressed the audit items that could make the public site look like it supports
engines, ad accounts, upload flows, or ownership markers that are not part of the current
SaveFileTool product.

The current public scope is RPG Maker save editing only.

## Fixes completed

| Audit item | Action taken | Status |
| --- | --- | --- |
| `robots.txt` pointed to `saveeditor.top` and blocked `/api/` | Sitemap changed to `https://savefiletool.com/sitemap-index.xml`; `/api/` disallow removed | Done |
| Old custom domain file | Deleted `public/CNAME` | Done |
| Old ad publisher file | Deleted `public/ads.txt` | Done |
| Old IndexNow key | Deleted `public/fe3e485b300864de61f9a339cbd1f801.txt` | Done |
| GA / AdSense identity in layout | Removed Google Analytics, AdSense, ad CSP domains, and related meta/script output from `BaseLayout.astro` | Done |
| Header and footer old brand | Changed visible brand to `SaveFileTool`; removed single-option language switch UI | Done |
| Manifest old brand | Changed `public/site.webmanifest` name and short name to `SaveFileTool` | Done |
| Service worker old cache and SQL assets | Renamed cache to `savefiletool-static-v1`; removed sql-wasm assets and `/api/` fetch special case | Done |
| Static headers for SQL assets | Removed `/sql-wasm-browser.js` and `/sql-wasm-browser.wasm` rules from `public/_headers` | Done |
| SQL wasm public assets | Deleted `public/sql-wasm-browser.js` and `public/sql-wasm-browser.wasm` | Done |
| Pages claiming ads / analytics | Rewrote privacy, cookie, about, index, and terms copy to match current no-third-party-ads/no-third-party-analytics build | Done |
| FAQ save path and upload wording | Updated RPG Maker MV/MZ path wording and changed visible "upload" instructions to choose/select where appropriate | Done |
| Coverage confidence | Changed `src/data/capability.ts` so synthetic-only evidence resolves to `candidate`, not `verified` | Done |
| Default indexing domains | Changed script defaults from `https://saveeditor.top` to `https://savefiletool.com` | Done |
| Local file handoff naming | Renamed IndexedDB store names and visible errors from upload vault language to local file handoff language; new URLs use `fileToken` while still reading old `uploadToken` links | Done |
| Contact/support subjects | Changed support mail subjects from SaveEditor to SaveFileTool | Done |
| License file | Added MIT `LICENSE` for the current repository declaration | Done |

## Upload/server check

`src/lib/upload-vault.ts` does not call a network API. It stores the selected `File` object in
browser IndexedDB, then the editor restores it from the same browser context. This is a local
handoff, not a server upload.

The exported function names still include `Upload` for compatibility with existing imports, but
the database names, URL parameter, and user-facing language now describe the flow as local file
handoff.

## Intentional exclusions

Parser source files under `src/lib/parsers/` were not removed or refactored in this pass. The
previous audit explicitly marked parser implementations as keep/no-touch because they are not
public landing pages or active support claims.

## Follow-up notes

The MIT license was added for this repository, but if any inherited upstream files were copied from
a source with a different license, that provenance should still be checked before commercial use.
