# Route and schema cleanup report

Date: 2026-09-29

## Source document

This pass followed the audit note that confirmed the previous cleanup and identified three remaining
items: the editor URL still said MV, the editor page lacked `BreadcrumbList`, and unused generic
extension constants remained in source.

## Fixes completed

| Audit item | Action taken | Status |
| --- | --- | --- |
| Editor route still used `/editor/rpg-maker-mv/` | Renamed the page route to `/editor/rpg-maker-mz/` and updated all internal links, helper scripts, generated LLM docs, and file handoff URLs | Done |
| Editor name still rendered `RPG Maker MV/MZ` | Changed the editor metadata name to `RPG Maker MZ`; H1 and `SoftwareApplication.name` now align with `.rmmzsave` scope | Done |
| Editor page lacked breadcrumb structured data | Added `BreadcrumbList` JSON-LD with Home and `RPG Maker MZ Save Editor` entries | Done |
| Generic extension constants remained in `saveExtensions.ts` | Removed unused `GENERIC_SAVE_EXTENSIONS`, `GENERIC_EXTENSION_SET`, and `GENERIC_DOTTED_EXTENSION_SET`; only `.rmmzsave` accept generation remains | Done |
| Anthropic crawler token was incomplete | Added `ClaudeBot` to `robots.txt` while retaining the existing AI crawler allow rules | Done |
| Remaining MV/MZ visible wording | Changed visible support/FAQ/editor labels to RPG Maker MZ where public scope is discussed | Done |

## Remaining blocker

Upstream authorization is still unresolved. The repository should not be treated as legally clean
for public/commercial launch until explicit upstream permission is obtained or inherited code is
replaced.
