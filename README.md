

![Title](assets/4.0/Title.png)
<div align="center">

[![Visual Studio Marketplace Version (including pre-releases)](https://img.shields.io/visual-studio-marketplace/v/SuperAnt.mc-dp-icons?style=for-the-badge&color=36a7dd)](https://marketplace.visualstudio.com/items?itemName=SuperAnt.mc-dp-icons)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/SuperAnt.mc-dp-icons?style=for-the-badge&color=36a7dd)](https://marketplace.visualstudio.com/items?itemName=SuperAnt.mc-dp-icons)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/SuperAnt.mc-dp-icons?style=for-the-badge&color=36a7dd)](https://marketplace.visualstudio.com/items?itemName=SuperAnt.mc-dp-icons)

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

### Namespace Icons
Namespace folders (folders directly within `data` and `assets`) will change their icons to ender chests. Works only if there is `pack.mcmeta` in the same directory.

![Icons](assets/3.0/NamespaceIcons.gif)

### pack.mcmeta detect
 Extension will look for `pack.mcmeta` in the workspace, and if it finds it, changes the icon theme from current to dp-icons. If not, the theme will change to a default one - either it will be the theme workspace was launched with, or defined in the settings.

![Icons](assets/3.0/PackMcmetaCheck.gif)


### Icons for `load` and `tick` functions
`tick` and `load` functions icons will change their icons to repeating and impulse command blocks accordingly, based on the values provided in `tick.json` and `load.json` files found in the workspace. This feature can be toggled to assign the icons not by the `tick.json` and `load.json` files, but by the functions names, which can be specified in the settings.

![Icons](assets/3.0/LoadTickFunctions.gif)


### Subfolder icons
Json files inside namespace subfolders will also change their icons (e.g. `data/namespace/item_modifier/some_folder/file.json` will change its icon to a diamond pickaxe when this is enabled). Not recommended for large workspaces. Works only if there is `pack.mcmeta` in the same directory.

![Icons](assets/4.0/SubfolderIcons.gif)


### Christmas icons
Similarly to minecraft, extension will change all of the icons that have chests to their christmas variants during December 24-26. This feature can be disabled or enabled to work at any time in the settings.

![Icons](assets/4.0/ChristmasIcons.png)

### Hide folder arrows
If you don't like these arrows near the folder icons, you can hide them by enabling this setting!

![Icons](assets/3.0/HideFolderArrows.gif)

</details>

---
## Creators
We are [FuncFusion](https://github.com/FuncFusion) - a small team of three:

[SuperAnt_](## "super.ant_ on discord") - Came up with the initial idea, made the extension

[bth123](https://github.com/bth123) - Made all the icons and illustrations, also made a [sublime port](https://github.com/bth123/mc-dp-icons-sublime) of this extension

[amandin](https://github.com/amqndin) - Coded most of the dynamic icons features, included this extension in his [amazing extension collection](https://marketplace.visualstudio.com/items?itemName=amandin.dpc-pack)

![Creators](assets/3.1/Creators.png)

**Enjoy!**
