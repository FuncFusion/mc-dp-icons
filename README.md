![Title](assets/title.png)
<div align="center">

[![Version](https://vsmarketplacebadges.dev/version-short/SuperAnt.mc-dp-icons.png?style=for-the-badge&color=36a7dd)](https://marketplace.visualstudio.com/items?itemName=SuperAnt.mc-dp-icons)
[![Installs](https://vsmarketplacebadges.dev/installs-short/SuperAnt.mc-dp-icons.png?style=for-the-badge&color=36a7dd)](https://marketplace.visualstudio.com/items?itemName=SuperAnt.mc-dp-icons)
[![Discord](https://img.shields.io/discord/1447615372353212713?label=Discord&logo=discord&style=for-the-badge&color=7289da)](https://discord.gg/wpzAVk8Wrc)

</div>

---
<sub><img src="assets/logo.png" width="18"></sub> Datapack Icons is a polished, Minecraft-inspired icon suite for the modern developer's workflow. Looking through [Microsoft's behavior packs documentation](https://learn.microsoft.com/en-us/minecraft/creator/documents/behaviorpack#building-the-behavior-pack), we took inspiration from those icons and decided to implement them in VS Code. 

## <sub><img src="assets/readme_icons/video_folder.png" width="28"></sub> 3.0 Trailer
Made by SuperAnt_: https://www.youtube.com/watch?v=eYAvg19stpU

[![Trailer](https://img.youtube.com/vi/eYAvg19stpU/0.jpg)](https://www.youtube.com/watch?v=eYAvg19stpU)

<details>
<summary><h2><sub><img src="assets/readme_icons/image_folder.png" width="28"></sub> Icons</h2></summary>

![Icons](assets/4.0/IconsDatapacks.png)
![Icons](assets/4.0/IconsResourcepacks.png)
![Icons](assets/4.0/IconsProgramming.png)
![Icons](assets/4.0/IconsBehaviorPacks.png)
![Icons](assets/4.0/IconsBedrockResourcepacks.png)

</details>

<details>
<summary><h2><sub><img src="assets/readme_icons/particles_folder.png" width="28"></sub> Dynamic Icons features</h2></summary>

### <sub><img src="assets/readme_icons/pack.mcmeta_file.png" width="24"></sub> Workspace Detection
**Want to use Datapack Icons only for Minecraft projects?** When enabled, this feature automatically switches your active icon theme to `mc-dp-icons` whenever it detects a Minecraft project in your current workspace. It works by scanning for <sub><img src="assets/readme_icons/pack.mcmeta_file.png" width="18"></sub> `pack.mcmeta`, Bedrock <sub><img src="assets/readme_icons/pack.mcmeta_file.png" width="18"></sub> `manifest.json`, <sub><img src="assets/readme_icons/beet_file.png" width="18"></sub> Beet or <sub><img src="assets/readme_icons/jmc_file.png" width="18"></sub> JMC config files. If not found, it restores your default icon theme. You can define a specific fallback theme in the settings or let the extension default to your previously active theme.

![Icons](assets/3.0/PackMcmetaCheck.gif)

### <sub><img src="assets/readme_icons/function_folder.png" width="24"></sub> Function Icons
By default, functions listed in your <sub><img src="assets/readme_icons/tick.json_file.png" width="18"></sub> `tick.json` and <sub><img src="assets/readme_icons/load.json_file.png" width="18"></sub> `load.json` files automatically receive <img src="assets/readme_icons/mcfunction_tick_file.png" width="18"> repeating and <img src="assets/readme_icons/mcfunction_load_file.png" width="18"> impulse command block icons. You can toggle this dynamic behavior off in the settings to assign these icons manually based on file names. Manual assignments support wildcards (e.g., `setup_*` or `*_loop`) to easily match multiple files at once.

![Icons](assets/3.0/LoadTickFunctions.gif)

### <sub><img src="assets/readme_icons/mcfunction_file_crowned.png" width="24"></sub> Crowned Function Icons
**Highlight your most important functions!** The extension has 3 special crowned command block icons (<sub><img src="assets/readme_icons/mcfunction_file_crowned.png" width="18"></sub> <sub><img src="assets/readme_icons/mcfunction_load_file_crowned.png" width="18"></sub> <sub><img src="assets/readme_icons/mcfunction_tick_file_crowned.png" width="18"></sub>) to help you visually prioritize specific functions. Add your chosen file names to the settings to apply these icons. Wildcards are also supported (e.g., `core_*` or `*helper*`) to easily match multiple files at once.

### <sub><img src="assets/readme_icons/loot_table_folder.png" width="24"></sub> Subfolder Icons
Due to VS Code API limitations, special icons can only be assigned to files directly inside a category folder (e.g.,  `data/namespace/item_modifier/`<sub><img src="assets/readme_icons/item_modifier_file.png" width="18"></sub>`file.json`). Enabling this option activates a workaround that bypasses this restriction, ensuring that nested files like `data/namespace/item_modifier/subfolder/`<sub><img src="assets/readme_icons/item_modifier_file.png" width="18"></sub>`file.json` get their specific icon rather than a generic one. Not recommended for extremely large workspaces. This requires a <sub><img src="assets/readme_icons/pack.mcmeta_file.png" width="18"></sub> `pack.mcmeta` file at the root of the pack.

![Icons](assets/4.0/SubfolderIcons.gif)

### <img src="assets/readme_icons/namespace_folder_closed.png" width="24"> Namespace Icons
Namespace folders (directories directly within <img src="assets/readme_icons/data_folder_closed.png" width="18"> `data` or <img src="assets/readme_icons/assets_folder_closed.png" width="18"> `assets`) receive an <sub><img src="assets/readme_icons/namespace_folder.png" width="18"></sub> ender chest icon. This requires a <sub><img src="assets/readme_icons/pack.mcmeta_file.png" width="18"></sub> `pack.mcmeta` file at the root of the pack.

![Icons](assets/3.0/NamespaceIcons.gif)

### <img src="assets/readme_icons/overlay_folder_closed.png" width="24"> Overlay Icons
Overlay folders (directories at the pack root registered as overlays in <sub><img src="assets/readme_icons/pack.mcmeta_file.png" width="18"></sub> `pack.mcmeta`) receive a <sub><img src="assets/readme_icons/overlay_folder.png" width="18"></sub> glass chest icon.

### <img src="assets/readme_icons/generic_folder_closed_xmas.png" width="24"> Christmas Icons
Similar to Minecraft, the extension changes all chest icons to their festive Christmas variants during December 24-26 (<sub><img src="assets/readme_icons/trading_folder.png" width="18"></sub> → <sub><img src="assets/readme_icons/trading_folder_xmas.png" width="18"></sub>). This feature can be disabled or enabled to work at any time in the settings.

![Icons](assets/4.0/ChristmasIcons.png)

### Hide Folder Arrows
Hides the default expand/collapse arrows next to folder icons in the VS Code Explorer to make your workspace feel less cluttered.

![Icons](assets/3.0/HideFolderArrows.gif)

</details>

---

## <sub><img src="assets/readme_icons/aseprite_file.png" width="28"></sub> Assets
You can find all the used (and unused!) assets during the development of Datapack Icons in our [assets repo](https://github.com/FuncFusion/mc-dp-icons-assets).

## <sub><img src="assets/readme_icons/contributing_file.png" width="28"></sub> Community & Feedback
If you need to report a bug, request a new icon or suggest a feature, you can do that in our <sub><img src="assets/readme_icons/discord.png" width="18"></sub> [discord server](https://discord.gg/9FMRD9GvAq) or by opening a [github issue](https://github.com/FuncFusion/mc-dp-icons/issues).

## <sub><img src="assets/readme_icons/mojo_file.png" width="28"></sub> Creators
We are [FuncFusion](https://github.com/FuncFusion) - a small team of three:

<sub><img src="assets/ant.png" width="18"></sub> [SuperAnt_](https://github.com/SuperAnt220) - Project Lead. Manages the theme architecture, documentation, and promotional assets.

<img src="assets/bth123.png" width="18"> [bth123](https://github.com/bth123) - Lead Artist. Designs all the icons and repository artwork, maintains the assets repo, and created a [sublime port](https://github.com/bth123/mc-dp-icons-sublime) of this extension.

<img src="assets/amandin.png" width="18"> [amandin](https://github.com/amqndin) - Lead developer behind all the code, and included this extension in his [amazing extension pack](https://marketplace.visualstudio.com/items?itemName=amandin.dpc-pack).

![Creators](assets/creators.png)

**Enjoy!**