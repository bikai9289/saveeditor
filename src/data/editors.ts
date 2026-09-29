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
    fileType: '.rpgsave, .rmmzsave, .rvdata2, .rvdata, .rxdata, .lsd',
    title: 'RPG Maker Save Editor - Free .rpgsave & .rmmzsave Editor',
    description:
      'Free RPG Maker save editor for .rpgsave, .rmmzsave, .rvdata2, .rvdata, .rxdata, and .lsd files. Edit compatible RPG Maker saves in your browser with no download.',
    keywords:
      'rpg maker save editor, rpgsave editor, rmmzsave editor, .rpgsave editor online, rpg maker mv save editor, rpg maker mz save editor, edit rpgsave file',
    features: [
      'Edit gold and money fields',
      'Modify common actor stats such as level, EXP, HP, and MP',
      'Adjust item, weapon, and armor quantities',
      'Edit RPG Maker variables and switches carefully',
    ],
    instructions: [
      'Locate your RPG Maker save file, usually in the game folder under `www/save/` or `save/`',
      'Choose a `.rpgsave`, `.rmmzsave`, `.rvdata2`, `.rvdata`, `.rxdata`, or `.lsd` file',
      'Edit common values such as gold, stats, items, variables, or switches',
      'Download the rebuilt save and keep your original backup until you verify it in game',
    ],
  },
];
