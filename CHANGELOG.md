# Change Log

All notable changes to the "mc-dp-icons" extension will be documented in this file.

## [3.0.0] - Programming Update
#### The total amount of icons now is 123, 118 of them are in use
### Added
- 67 new icons, including:
    - 47 icons for programming (languages, packages, `src` folder etc.) and other common file extensions (archives, doc files, excel files, 3d models etc.);
    - 14 new icons for datapacks (`datapacks` folder, `load.json`, `tick.json`, `.jmc` files, json files directly in folders `predicates`, `item_modifier`, `damage_type` etc.[^1])
    - 6 new icons for resource packs (`.bbmodel`, json files directly in `atlases`, `blockstates`, `font`, `lang`, `particles`[^1])
- Extension will now be able to search for `pack.mcmeta` in the workspace, and if it finds it, changes the icon theme from current to dp-icons. If not, the theme will change to a default one - either it will be the theme workspace was launched with, or defined in the settings. This feature can be turned off in the settings. 
- Namespace icons are no longer unused! The extension will now find any folders directly within `data` and `assets` folders and assign ender chest icon to the names of these folders, but only if there's `pack.mcmeta` in the same directory. That also means that if there will be a folder in any location with the same name as one of the namespace folders in the same workspace, that folder will also recieve ender chest icon, so this feature can be turned off in the settings.
- `tick` and `load` functions icons will now be able to change their icons to repeating and impulse command blocks accordingly, based on the values provided in `tick.json` and `load.json` files found in the workspace. This feature can be toggled to assign the icons not by the `tick.json` and `load.json` files, but by the functions names, which can be specified in the settings.
- Webpack support, which makes `pack.mcmeta` detect feature be available in VS Code Web. Other features are currently not supported.

[^1]: json files in the subfolders of these folders do not currently change have these icons. This feature may be added in the future.
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