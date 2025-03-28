# Change Log

All notable changes to the "mc-dp-icons" extension will be documented in this file.

## [4.0.2] - Minor fixes (2025-03-25)
- Update amandin's github link in README.md.
- [Issue 28](https://github.com/FuncFusion/mc-dp-icons/issues/28) regarding `language_name.json` not having a lang icon.

## [4.0.1] - Minor fixes (2025-02-23)
- Fix json files inside `loot_table` folder not having the right icon.
- [Issue 26](https://github.com/FuncFusion/mc-dp-icons/issues/26) regarding json files inside `items` folder in resource packs not having the right icon.

## [4.0.0] - Bedrock Update (2024-12-24)
### The total amount of icons now is 235, 225 of them in use, and 54 of *them* are christmas variants
### Added
- New `Subfolder icons` system! Now all `.json` files within nested subfolders of datapack and resource pack directories will receive their unique icons (e.g., `data/namespace/item_modifier/some_other_folder/file.json` will display a diamond pickaxe icon instead of a generic `.json` icon), which solves this[^1]. Remember that same as all other dynamic icons features, this is a **workaround** due to VS Code's API limitations, so files with identical names and parent folder names may cause icon conflicts (e.g., both `data/namespace/item_modifier/some_other_folder/file.json` and `data/namespace/loot_table/some_other_folder/file.json` might show the diamond pickaxe icon, even though the latter should display an emerald icon). For large workspaces with a large amount of json files in subfolders (like a vanilla datapack), consider disabling this feature in settings to prevent lag.

- Christmas icons! Similarly to minecraft, the icon theme will change all of the icons that have chests to their christmas variants during December 24-26. This feature can be disabled or enabled to work at any time in the settings.

- 98 new icons, including:
    - 29 icons for bedrock behaviour packs and resource packs (`entities`, `attachables`, `spawn_rules`, `render_controllers`, `biomes_client.json` etc.)
    - 4 new 1.21 java datapack icons (`instrument`, `trial_spawner`) and resource pack icons (`equipment`, `items`)
    - 9 new subfolder icons for java datapack and resource pack folders (`advancement`, `equipment`, `instrument`, `items`, `loot_table`, `shaders`, `tags`, `trial_spawner` and `worldgen` json files)
    - 54 icons as christmas variants to all of the icons with a chest (excluding `src`)
    - `.svelte` icon
    - Armor stand icon for [Animated Java](https://animated-java.dev/) files (`.ajmeta`, `.ajblueprint`, `.ajmodel`)

- 200+ more programming and general file extensions assigns for existing icons.
### Changed
- `css` icon updated to match the new Rebecca Purple logo
- `tags` folder icon got a redesign to match the style more
- `trim_material` and `trim_pattern` folder and file icons slightly changed to match the style more

## [3.1.1] - Minor fixes (2024-06-13)
- Pack mcmeta check feature is now disabled by default.
- [Issue 5](https://github.com/FuncFusion/mc-dp-icons/issues/5) regarding .JSX and .TSX files having incorrect icons fixed.

## [3.1.0] - 1.21 Update (2024-01-06)
#### The total amount of icons now is 136, 127 of them are in use
### Added
- 10 new icons, including icons for new 1.21 datapack folders.
- 1.21 renamed datapack folders (advancements -> advancement etc.) are now also supported.
### Changed
- 3 vscode icons has changed their appearance: `.vscode` folder, `.vscodeignore` files and vscode files to match the style. Their old versions are still in the repo but are not being used.
- License icon has been changed to a trial key.
- Fixed a bug where `.vscode` folder will appear in unnecessary cases.
### Deleted
- Enchanted book icon, as it was unused and now replaced by a better enchanted book icon for `enchantment` in datapacks

## [3.0.1] - Bug fix (2024-01-03)
- Fixed a bug where if a user had only one tick.json/load.json file, but not both of them, dynamic functions' icon change wouldn't work
- Changed the logo of the extension from christmas variant to a usual one

## [3.0.0] - Programming Update (2023-12-31)
#### The total amount of icons now is 123, 118 of them are in use
### Added
- 67 new icons, including:
    - 47 icons for programming (languages, packages, `src` folder etc.) and other common file extensions (archives, doc files, excel files, 3d models etc.);
    - 14 new icons for datapacks (`datapacks` folder, `load.json`, `tick.json`, `.jmc` files, json files directly in folders `predicates`, `item_modifier`, `damage_type` etc.[^1])
    - 6 new icons for resource packs (`.bbmodel`, json files directly in `atlases`, `blockstates`, `font`, `lang`, `particles`[^1])
- Extension will now be able to search for `pack.mcmeta` in the workspace, and if it finds it, changes the icon theme from current to dp-icons. If not, the theme will change to a default one - either it will be the theme workspace was launched with, or defined in the settings. This feature can be turned off in the settings. 
- Namespace icons are no longer unused! The extension will now find any folders directly within `data` and `assets` folders and assign ender chest icon to the names of these folders, but only if there's `pack.mcmeta` in the same directory. That also means that if there will be a folder in any location with the same name as one of the namespace folders in the same workspace, that folder will also recieve ender chest icon, so this feature can be turned off in the settings.
- `tick` and `load` functions icons will now be able to change their icons to repeating and impulse command blocks accordingly, based on the values provided in `tick.json` and `load.json` files found in the workspace. This feature can be toggled to assign the icons not by the `tick.json` and `load.json` files, but by the functions names, which can be specified in the settings.
- A setting to hide folder arrows in the explorer.
- Webpack support, which makes `pack.mcmeta` detect feature be available in VS Code Web. Other features are currently not supported.

[^1]: json files in the subfolders of these folders do not currently have these icons. This feature may be added in the future.
### Changed
- Converted the language of the extension from javascript to typescript
- `recipes` icon was changed to a better one

## [2.0.1] - fix readme (2023-08-22)

## [2.0.0] - Resourcepack Update (2023-08-22)
#### The total of icons now is 56, 50 of them are in use
### Added
- Support for VS Code Web
- Source pngs of all 56 icons into the repository
- 28 new icons, 25 of them are in use:
    - 17 icons for resourcepacks
    - 2 new icons for 1.20 datapack folders (`trim_pattern` and `trim_material`)
    - An icon for `dimension_type` subfolder
    - 2 new icons for `LICENSE` and `COPYRIGHT` files
    - 2 new icons for `beet.json`, `beet.yml` and `.bolt` files
    - An icon for `.txt` files
    - 3 unused icons (`particles` with three particles, `pack.mcmeta` with halved shulker, `dimension_type` with the whole end portal)
### Changed
- `dimension` icon became a block of nether portal, old one became unused
- `loot_tables` icon has been slightly changed

## [1.0.2] - More tweaks (2023-04-01)
### Added
Repeating command block icon for everytick.mcfunction and gametick.mcfunction
Impulse command block icon start.mcfunction and initial.mcfunction

## [1.0.1] - Some tweaks (2023-04-01)

## [1.0.0] - Main release (2023-03-31)
### Added
27 icons, 25 of them are in use
