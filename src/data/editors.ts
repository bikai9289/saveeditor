/**
 * Centralized editor data for the currently published editor landing page.
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
    slug: 'rpg-maker-mv',
    name: 'RPG Maker MV/MZ',
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
];
