import { writeFileSync } from 'node:fs';
import { sampleRecords } from '../src/data/capability';
import { SITE_ORIGIN } from '../src/lib/site';

const origin = (process.env.PUBLIC_SITE_ORIGIN || SITE_ORIGIN).replace(/\/+$/, '');

const llms = `# SaveFileTool

> Browser-based RPG Maker MZ save editor for tested local .rmmzsave files.

For full documentation, see: ${origin}/llms-full.txt

## Current Public Routes

- /
- /editor/rpg-maker-mz/
- /faq/
- /support/
- /about/
- /contact/
- /privacy/
- /terms/
- /cookie-policy/

## Published Editor Scope

- RPG Maker MZ: .rmmzsave

Other RPG Maker extensions are candidates only and are not part of the public support promise until real-save verification is complete.

SaveFileTool does not claim public editor support for other game engines on this build. Files are processed by the main editor in the browser.
`;

const llmsFull = `# SaveFileTool

> Browser-based RPG Maker MZ save editor for tested local .rmmzsave files.

## Site Identity

- **Name**: SaveFileTool
- **URL**: ${origin}
- **Type**: Free web application
- **Category**: UtilitiesApplication
- **Operating System**: Web Browser
- **Pricing**: Free, no registration required
- **File size limit**: 10 MB per file

## Current Public Routes

| Page | URL |
| --- | --- |
| Home | ${origin}/ |
| RPG Maker Editor | ${origin}/editor/rpg-maker-mz/ |
| FAQ | ${origin}/faq/ |
| Support | ${origin}/support/ |
| About | ${origin}/about/ |
| Contact | ${origin}/contact/ |
| Privacy | ${origin}/privacy/ |
| Terms | ${origin}/terms/ |
| Cookie Policy | ${origin}/cookie-policy/ |

## Published Editor Scope

| Scope | Extensions | Notes |
| --- | --- | --- |
| RPG Maker MZ | .rmmzsave | Browser-side edit and rebuild for tested saves |

## Evidence Status

- **Sample records retained**: ${sampleRecords.length} RPG Maker fixture records for candidate engineering checks
- **Real sample count claimed**: 0
- **Public scope**: tested RPG Maker MZ .rmmzsave entry only

Other RPG Maker extensions are candidates only and are not part of the public support promise until real-save verification is complete.

## Safety Boundary

SaveFileTool does not claim public editor support for other game engines on this build. The main editing workflow processes files in the browser and requires a user-selected local file.
`;

writeFileSync('public/llms.txt', llms);
writeFileSync('public/llms-full.txt', llmsFull);
