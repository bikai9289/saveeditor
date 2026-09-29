import { writeFileSync } from 'node:fs';
import { sampleRecords } from '../src/data/capability';
import { SITE_ORIGIN } from '../src/lib/site';

const origin = (process.env.PUBLIC_SITE_ORIGIN || SITE_ORIGIN).replace(/\/+$/, '');

const llms = `# SaveFileTool

> Browser-based RPG Maker save editor for compatible local save files.

For full documentation, see: ${origin}/llms-full.txt

## Current Public Routes

- /
- /editor/rpg-maker-mv/
- /faq/
- /support/
- /about/
- /contact/
- /privacy/
- /terms/
- /cookie-policy/

## Published Editor Scope

- RPG Maker MV/MZ: .rpgsave, .rmmzsave
- RPG Maker XP/VX/VX Ace: .rvdata2, .rvdata, .rxdata limited common-field editing
- RPG Maker 2000/2003: .lsd limited common-field editing

SaveFileTool does not claim public editor support for other game engines on this build. Files are processed by the main editor in the browser.
`;

const llmsFull = `# SaveFileTool

> Browser-based RPG Maker save editor for compatible local save files.

## Site Identity

- **Name**: SaveFileTool
- **URL**: ${origin}
- **Type**: Free web application
- **Category**: UtilitiesApplication
- **Operating System**: Web Browser
- **Pricing**: Free, no registration required
- **File size limit**: 50 MB per file

## Current Public Routes

| Page | URL |
| --- | --- |
| Home | ${origin}/ |
| RPG Maker Editor | ${origin}/editor/rpg-maker-mv/ |
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
| RPG Maker MV/MZ | .rpgsave, .rmmzsave | Browser-side edit and rebuild for compatible saves |
| RPG Maker XP/VX/VX Ace | .rvdata2, .rvdata, .rxdata | Limited common-field editing |
| RPG Maker 2000/2003 | .lsd | Limited common-field editing |

## Evidence Status

- **Sample records retained**: ${sampleRecords.length} RPG Maker fixture records
- **Real sample count claimed**: 0
- **Public scope**: RPG Maker save editing only

## Safety Boundary

SaveFileTool does not claim public editor support for other game engines on this build. The main editing workflow processes files in the browser and requires a user-selected local file.
`;

writeFileSync('public/llms.txt', llms);
writeFileSync('public/llms-full.txt', llmsFull);
