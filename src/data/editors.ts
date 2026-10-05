/**
 * Centralized editor data for the published editor landing pages.
 */

export interface EditorData {
  slug: string;
  name: string;
  fileType: string;
  title: string;
  description: string;
  keywords: string;
  features: string[];
  instructions: string[];
}

export const editors: EditorData[] = [
  {
    slug: 'rpg-maker-mz',
    name: 'RPG Maker MZ',
    fileType: '.rmmzsave',
    title: 'RPG Maker MZ Save Editor - Free .rmmzsave Editor',
    description:
      'Free RPG Maker MZ save editor for tested .rmmzsave files. Edit compatible saves in your browser with no download.',
    keywords:
      'rpg maker mz save editor, rmmzsave editor, .rmmzsave editor online, edit rmmzsave file',
    features: [
      'Edit gold and money fields tested on a real .rmmzsave workflow',
      'Review candidate actor, inventory, variable, and switch fields with backup-first warnings',
    ],
    instructions: [
      'Locate your RPG Maker MZ save file, usually in the game folder under `save/`',
      'Choose a `.rmmzsave` file',
      'Edit tested gold values first; treat other detected fields as candidate fields until you verify them in game',
      'Download the rebuilt save and keep your original backup until you verify it in game',
    ],
  },
  {
    slug: 'rpg-maker-mv',
    name: 'RPG Maker MV',
    fileType: '.rpgsave',
    title: 'RPG Maker MV Save Editor - Free .rpgsave Editor Online',
    description:
      'Free .rpgsave editor for RPG Maker MV saves. Edit gold locally in your browser and download the edited save with an original backup. No installation or signup.',
    keywords:
      'rpgsave editor, rpg maker mv save editor, .rpgsave editor online, edit rpgsave file',
    features: [
      'Gold editing verified in an official RPG Maker MV 1.6.1 trial project: 1234 to 98765, confirmed by loading the edited save in game',
      'Process .rpgsave files locally in your browser without uploading save contents',
      'Download the edited save and an unchanged original backup together in a zip',
      'Review candidate actor, inventory, variable, and switch fields; verify changes in your own game',
    ],
    instructions: [
      'Save your game and copy the original `file1.rpgsave` before editing',
      'Find your desktop MV save in the game folder under `www/save/` or `save/`; browser-only games may keep saves in browser storage instead',
      'Choose a `.rpgsave` file on this page. For `.rmmzsave` files, use the separate MZ editor',
      'Start with a small gold change. The verified workflow uses an official trial project; custom game plugins may use different save structures',
      'Download and extract the zip, place the edited save in its original save folder, then load it in your game. Keep the backup until the new value is confirmed',
    ],
  },
];
