# Change Log

All notable changes to the "mc-dp-icons" extension will be documented in this file.

## [5.0.0] - Deep Dive Update (2026-08-08)
### The total amount of icons now is 418, and 95 of them are christmas variants
### Added
- New `Overlay icons` feature! Overlay folders (folders at the root of a pack that contain a `data` or `assets` folder in them) now receive a glass chest icon, just like namespace folders receive an ender chest one. Requires a `pack.mcmeta` at the root of the pack, and can be turned off in the settings.

- New `Crowned function icons`! Since functions usually make up the vast majority of files in a datapack, it can be hard to tell your core logic apart from the rest, so we added 3 crowned command block variants (chain, repeating and impulse) to highlight your most important functions.

- Function icons can now be assigned manually! Right-click any function file and use the `Datapack Icons: Set Icon` menu to assign any of the 5 special command block icons, or reset it back to default. The same can be done through the settings by file name.

- [GlobPatterns](https://code.visualstudio.com/api/references/vscode-api#GlobPattern) support in all function name settings (e.g. `*_setup`, `*helper*` or `phase_[0-9]`), so you can match a whole bunch of files at once. You can also specify the direct parent folder name (e.g. `subfolder/file`) for maximum precision when two or more functions share a name.

- `Workspace detection` (previously `pack.mcmeta check`) is now build-system agnostic - besides `pack.mcmeta` it also looks for bedrock `manifest.json`, [Beet](https://github.com/mcbeet/beet) and [JMC](https://jmc.wingedseal.com/) config files, so the theme switches on for your project no matter how it's built.

- Two new helpful prompts: one offers to disable `explorer.compactFolders` (which breaks folder icons for nested folders), and one warns you when a workspace has over 1024 subfolder files. That is where the `Subfolder icons` workaround starts hitting the limits of VS Code's renderer, so past that point the feature might not work properly.

- `Subfolder icons` feature is now **enabled by default**.

- A `debug` setting, which makes the extension log everything it does into its own `Datapack Icons` output channel.

- 196 new icons, including:
    - 37 new programming language icons
    - 83 new general and tooling icons, including a whole set for the minecraft modding and plugin development (`fabric`, `forge`, `quilt`, `spigot`, `paper`, `purpur`, `bukkit`)
    - 33 new datapack icons, including all the new folders and files (`dialog`, `test_environment`, `test_instance`, and the `cat`, `chicken`, `cow`, `frog`, `pig` and `zombie_nautilus` variants), icons for DSLs ([MCBuild](https://mcbuild.dev/), [Sandstone](https://sandstone.dev/), [Flare](https://flare.oguzhanumutlu.com/)) and more.
    - 3 new resource pack icons (`waypoint_style` file & folder, and Blockbench icon)
    - 42 new christmas variants, covering every single new folder icon with a chest in it

- A lot of new assigns for existing icons: 782 file extensions (up from 522), 140 file names (up from 26) and 248 folder names (up from 66).

- A [Zed](https://github.com/FuncFusion/mc-dp-icons-zed) port and a [Sublime Text](https://github.com/FuncFusion/mc-dp-icons-sublime) port of the theme.

### Changed
- All 418 icon svgs were replaced with new, cleaner, optimized versions, which makes the files 6x smaller on average.

- The whole extension was rewritten from the ground up. The icon theme is no longer a hand-written json file - it's now generated at build time from typed icon definitions split by category (datapack, resource pack, bedrock addon, bedrock resource pack, languages, general), which makes adding and maintaining icons a lot less painful. The extension was also migrated to esbuild, `vscode-uri` and `vscode.workspace.fs`, and got a full test suite.

- All icon files were renamed to a consistent `name_file` / `name_folder` / `name_folder_closed` / `name_folder_xmas` standard.

- All settings were renamed to be shorter and clearer, and are now grouped into `Workspace Detection`, `Function Icons`, `Dynamic Icons` and `Other` sections:
    - `enablePackMcmetaCheck` → `workspaceDetection`
    - `setDefaultIconTheme` → `fallbackIconTheme`
    - `enableLoadTickAutoChange` → `dynamicFunctionIcons`
    - `functionNamesForTick` → `tickFunctionNames`
    - `functionNamesForLoad` → `loadFunctionNames`
    - `enableSubfolderIcons` → `subfolderIcons`
    - `enableNamespaceIcons` → `namespaceIcons`
    - `enableChristmasIcons` → `christmasIcons`

- A lot of bugfixes, the most notable being [issue 29](https://github.com/FuncFusion/mc-dp-icons/issues/29), which caused extreme activation times and freezes when renaming a file/folder.

- The extension is now licensed under **MIT** instead of AGPL-3.0.
### Deleted
- 13 old icons: the 10 leftover unused ones from previous versions, plus the `textures` folder icon and its christmas variant (that folder now uses the image icon) and the sublime package icon (`.sublime-package` now uses the archive icon).

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

- 97 new icons, including:
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
- 9 new icons, including icons for new 1.21 datapack folders.
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
