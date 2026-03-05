![Title](assets/4.0/Title.png)
<div align="center">

[![Version](https://vsmarketplacebadges.dev/version-short/SuperAnt.mc-dp-icons.svg?style=for-the-badge&color=36a7dd)](https://marketplace.visualstudio.com/items?itemName=SuperAnt.mc-dp-icons)
[![Installs](https://vsmarketplacebadges.dev/installs-short/SuperAnt.mc-dp-icons.svg?style=for-the-badge&color=36a7dd)](https://marketplace.visualstudio.com/items?itemName=SuperAnt.mc-dp-icons)
[![Downloads](https://vsmarketplacebadges.dev/downloads-short/SuperAnt.mc-dp-icons.svg?style=for-the-badge&color=36a7dd)](https://marketplace.visualstudio.com/items?itemName=SuperAnt.mc-dp-icons)
[![Discord](https://img.shields.io/discord/1447615372353212713?label=Discord&logo=discord&style=for-the-badge&color=7289da)](https://discord.gg/wpzAVk8Wrc)

</div>

---
Datapack Icons is a polished, Minecraft-inspired icon suite for the modern developer's workflow. Looking through [Microsoft's behavior packs documentation](https://learn.microsoft.com/en-us/minecraft/creator/documents/behaviorpack#building-the-behavior-pack), we took inspiration from those icons and decided to implement them in VS Code. 

## 3.0 Trailer
Made by SuperAnt_: https://www.youtube.com/watch?v=eYAvg19stpU

[![Trailer](https://img.youtube.com/vi/eYAvg19stpU/0.jpg)](https://www.youtube.com/watch?v=eYAvg19stpU)

<details>
<summary><h2>Icons</h2></summary>

![Icons](assets/4.0/IconsDatapacks.png)
![Icons](assets/4.0/IconsResourcepacks.png)
![Icons](assets/4.0/IconsProgramming.png)
![Icons](assets/4.0/IconsBehaviorPacks.png)
![Icons](assets/4.0/IconsBedrockResourcepacks.png)

</details>

<details>
<summary><h2>Dynamic Icons features</h2></summary>

### <img src="icons/namespace_folder_closed.svg" width="24"> Namespace Icons
Namespace folders (folders directly within <img src="icons/data_folder_closed.svg" width="18"> `data` and <img src="icons/assets_folder_closed.svg" width="18"> `assets`) will change their icons to <img src="icons/namespace_folder_closed.svg" width="18"> ender chests. This works only if there is a <img src="icons/pack.mcmeta_file.svg" width="18"> `pack.mcmeta` file in the same directory.

![Icons](assets/3.0/NamespaceIcons.gif)

### <img src="icons/pack.mcmeta_file.svg" width="24"> pack.mcmeta detect
The extension will look for <img src="icons/pack.mcmeta_file.svg" width="18"> `pack.mcmeta` in the workspace, and if it finds it, changes the icon theme from the current one to mc-dp-icons. If not, the theme will change to a default one - either the theme the workspace was launched with, or the one defined in the settings.

![Icons](assets/3.0/PackMcmetaCheck.gif)


### <img src="icons/function_folder.svg" width="24"> Icons for `load` and `tick` functions
The icons for <img src="icons/mcf_tick_file.svg" width="18"> `tick` and <img src="icons/mcf_load_file.svg" width="18"> `load` functions will change to repeating and impulse command blocks respectively, based on the values provided in the <img src="icons/tick.json_file.svg" width="18"> `tick.json` and <img src="icons/load.json_file.svg" width="18"> `load.json` files found in the workspace. This feature can be toggled to assign the icons based on the functions' names (which can be specified in the settings) instead of the <img src="icons/tick.json_file.svg" width="18"> `tick.json` and <img src="icons/load.json_file.svg" width="18"> `load.json` files.

![Icons](assets/3.0/LoadTickFunctions.gif)


### Subfolder icons
JSON files inside namespace subfolders will also change their icons (e.g. `data/namespace/item_modifier/some_folder/file.json` will change its icon to a diamond pickaxe when this is enabled). Not recommended for large workspaces. Works only if there is a `pack.mcmeta` file in the same directory.

![Icons](assets/4.0/SubfolderIcons.gif)


### Christmas icons
Similarly to minecraft, the extension will change all of the chest icons to their Christmas variants during December 24-26. This feature can be disabled or enabled to work at any time in the settings.

![Icons](assets/4.0/ChristmasIcons.png)

### Hide folder arrows
If you don't like the arrows near the folder icons, you can hide them by enabling this setting!

![Icons](assets/3.0/HideFolderArrows.gif)

</details>

---

## Assets
You can find all the assets used during the development of Datapack Icons in our [assets repo](https://github.com/FuncFusion/mc-dp-icons-assets).

## Creators
We are [FuncFusion](https://github.com/FuncFusion) - a small team of three:

[SuperAnt_](https://github.com/SuperAnt220) - Came up with the initial idea, made the extension

[bth123](https://github.com/bth123) - Made all the icons and illustrations, also made a [sublime port](https://github.com/bth123/mc-dp-icons-sublime) of this extension

[amandin](https://github.com/amqndin) - Responsible for most of the code, included this extension in his [amazing extension pack](https://marketplace.visualstudio.com/items?itemName=amandin.dpc-pack)

![Creators](assets/3.1/Creators.png)

**Enjoy!**