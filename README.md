![Title](assets/title.png)
<div align="center">

[![Version](https://vsmarketplacebadges.dev/version-short/SuperAnt.mc-dp-icons.svg?style=for-the-badge&color=36a7dd)](https://marketplace.visualstudio.com/items?itemName=SuperAnt.mc-dp-icons)
[![Installs](https://vsmarketplacebadges.dev/installs-short/SuperAnt.mc-dp-icons.svg?style=for-the-badge&color=36a7dd)](https://marketplace.visualstudio.com/items?itemName=SuperAnt.mc-dp-icons)
[![Discord](https://img.shields.io/discord/1447615372353212713?label=Discord&logo=discord&style=for-the-badge&color=7289da)](https://discord.gg/wpzAVk8Wrc)

</div>

---
<sub><img src="assets/logo.png" width="18"></sub> Datapack Icons is a polished, Minecraft-inspired icon suite for the modern developer's workflow. Looking through [Microsoft's behavior packs documentation](https://learn.microsoft.com/en-us/minecraft/creator/documents/behaviorpack#building-the-behavior-pack), we took inspiration from those icons and decided to implement them in VS Code. 

## <sub><img src="icons/video_folder.svg" width="28"></sub> 3.0 Trailer
Made by SuperAnt_: https://www.youtube.com/watch?v=eYAvg19stpU

[![Trailer](https://img.youtube.com/vi/eYAvg19stpU/0.jpg)](https://www.youtube.com/watch?v=eYAvg19stpU)

<details>
<summary><h2><sub><img src="icons/image_folder.svg" width="28"></sub> Icons</h2></summary>

![Icons](assets/4.0/IconsDatapacks.png)
![Icons](assets/4.0/IconsResourcepacks.png)
![Icons](assets/4.0/IconsProgramming.png)
![Icons](assets/4.0/IconsBehaviorPacks.png)
![Icons](assets/4.0/IconsBedrockResourcepacks.png)

</details>

<details>
<summary><h2><sub><img src="icons/particles_folder.svg" width="28"></sub> Dynamic Icons features</h2></summary>

### <sub><img src="icons/pack.mcmeta_file.svg" width="24"></sub> Workspace Detection
**Want to use Datapack Icons only for Minecraft projects?** When enabled, this feature automatically switches your active icon theme to `mc-dp-icons` whenever it detects a Minecraft pack in your current workspace (by looking for <sub><img src="icons/pack.mcmeta_file.svg" width="18"></sub> `pack.mcmeta`). If not found, it restores your default icon theme. You can define a specific fallback theme in the settings or let the extension default to your previously active theme.

![Icons](assets/3.0/PackMcmetaCheck.gif)

### <sub><img src="icons/function_folder.svg" width="24"></sub> Function Icons
The icons for <img src="icons/mcfunction_tick_file.svg" width="18"> `tick` and <img src="icons/mcfunction_load_file.svg" width="18"> `load` functions will change to repeating and impulse command blocks respectively, based on the functions provided in the <sub><img src="icons/tick.json_file.svg" width="18"></sub> `tick.json` and <sub><img src="icons/load.json_file.svg" width="18"></sub> `load.json` files found in the workspace. This feature can be toggled to assign the icons based on the functions' names (which can be specified in the settings) instead of the <sub><img src="icons/tick.json_file.svg" width="18"></sub> `tick.json` and <sub><img src="icons/load.json_file.svg" width="18"></sub> `load.json` files.

![Icons](assets/3.0/LoadTickFunctions.gif)

### <sub><img src="icons/mcfunction_file_crowned.svg" width="24"></sub> Crowned Function Icons
TODO

### <sub><img src="icons/loot_table_folder.svg" width="24"></sub> Subfolder Icons
JSON files inside namespace subfolders will also change their icons (e.g. `data/namespace/item_modifier/some_folder/file.json` will change its icon to a <sub><img src="icons/item_modifier_file.svg" width="18"></sub> diamond pickaxe when this is enabled). Not recommended for large workspaces. Works only if there is a <sub><img src="icons/pack.mcmeta_file.svg" width="18"></sub> `pack.mcmeta` file in the same directory.

![Icons](assets/4.0/SubfolderIcons.gif)

### <img src="icons/namespace_folder_closed.svg" width="24"> Namespace Icons
Namespace folders (folders directly within <img src="icons/data_folder_closed.svg" width="18"> `data` and <img src="icons/assets_folder_closed.svg" width="18"> `assets`) will change their icons to <sub><img src="icons/namespace_folder.svg" width="18"></sub> ender chests. Works only if there is a <sub><img src="icons/pack.mcmeta_file.svg" width="18"></sub> `pack.mcmeta` file in the same directory.

![Icons](assets/3.0/NamespaceIcons.gif)

### <img src="icons/overlay_folder_closed.svg" width="24"> Overlay Icons
Overlay folders (folders in the root of datapacks & resource packs that are registered as overlays in <sub><img src="icons/pack.mcmeta_file.svg" width="18"></sub> `pack.mcmeta`) will change their icons to <sub><img src="icons/overlay_folder.svg" width="18"></sub> glass chests.

### <img src="icons/generic_folder_closed_xmas.svg" width="24"> Christmas Icons
Similarly to minecraft, the extension will change all of the chest icons to their Christmas variants during December 24-26 (<sub><img src="icons/trading_folder.svg" width="18"></sub> → <sub><img src="icons/trading_folder_xmas.svg" width="18"></sub>). This feature can be disabled or enabled to work at any time in the settings.

![Icons](assets/4.0/ChristmasIcons.png)

### Hide Folder Arrows
If you don't like the arrows near the folder icons, you can hide them by enabling this setting!

![Icons](assets/3.0/HideFolderArrows.gif)

</details>

---

## <sub><img src="icons/aseprite_file.svg" width="28"></sub> Assets
You can find all the used (and unused!) assets during the development of Datapack Icons in our [assets repo](https://github.com/FuncFusion/mc-dp-icons-assets).

## <sub><img src="icons/contributing_file.svg" width="28"></sub> Community & Feedback
If you need to report a bug, request a new icon or suggest a feature, you can do that in our <sub><img src="assets/discord.png" width="18"></sub> [discord server](https://discord.gg/9FMRD9GvAq) or by opening a [github issue](https://github.com/FuncFusion/mc-dp-icons/issues).

## <sub><img src="icons/mojo_file.svg" width="28"></sub> Creators
We are [FuncFusion](https://github.com/FuncFusion) - a small team of three:

<sub><img src="assets/ant.png" width="18"></sub> [SuperAnt_](https://github.com/SuperAnt220) - Came up with the initial idea, made the extension

<img src="assets/bth123.png" width="18"> [bth123](https://github.com/bth123) - Made all the icons and illustrations, also made a [sublime port](https://github.com/bth123/mc-dp-icons-sublime) of this extension

<img src="assets/amandin.png" width="18"> [amandin](https://github.com/amqndin) - Responsible for most of the code, included this extension in his [amazing extension pack](https://marketplace.visualstudio.com/items?itemName=amandin.dpc-pack)

![Creators](assets/creators.png)

**Enjoy!**