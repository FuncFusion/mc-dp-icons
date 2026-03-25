import * as vscode from "vscode";
import * as path from "path";
import {
  pathExists,
  setThemeValue,
  getFilesInDirectory,
  warnAboutTooManyFiles,
  getConfig,
  getReferencesFromFunctionTags,
  getPartialMatches,
} from "./main";
import { workspace } from "vscode";

const fs = workspace.fs;

const subfolderIconMap: Record<string, string> = {
  // Datapacks
  advancement: "advancement_file",
  advancements: "advancement_file",
  banner_pattern: "banner_pattern_file",
  cat_sound_variant: "cat_variant_file",
  cat_variant: "cat_variant_file",
  chicken_sound_variant: "chicken_variant_file",
  chicken_variant: "chicken_variant_file",
  cow_sound_variant: "cow_variant_file",
  cow_variant: "cow_variant_file",
  damage_type: "damage_type_file",
  dialog: "dialog_file",
  dimension: "dimension_file",
  dimension_type: "dimension_type_file",
  enchantment: "enchantment_file",
  enchantment_provider: "enchantment_file",
  frog_variant: "frog_variant_file",
  instrument: "instrument_file",
  item_modifier: "item_modifier_file",
  item_modifiers: "item_modifier_file",
  jukebox_song: "jukebox_song_file",
  loot_table: "loot_table_file",
  loot_tables: "loot_table_file",
  painting_variant: "image_file",
  pig_sound_variant: "pig_variant_file",
  pig_variant: "pig_variant_file",
  predicate: "predicate_file",
  predicates: "predicate_file",
  recipe: "recipe_file",
  recipes: "recipe_file",
  tags: "tags_file",
  test_environment: "test_environment_file",
  test_instance: "test_instance_file",
  timeline: "timeline_file",
  trade_set: "trading_file",
  trial_spawner: "trial_spawner_file",
  trim_material: "trim_material_file",
  trim_pattern: "trim_pattern_file",
  villager_trade: "trading_file",
  wolf_sound_variant: "wolf_variant_file",
  wolf_variant: "wolf_variant_file",
  world_clock: "timeline_file",
  worldgen: "worldgen_file",
  zombie_nautilus_variant: "zombie_nautilus_variant_file",

  // Resourcepacks
  font: "font_file",
  items: "items_file",
  models: "models_file",
  post_effect: "shaders_file",
  shaders: "shaders_file",
  waypoint_style: "waypoint_style_file",
};

// This function is called in extension.ts
export async function update() {
  if (await noJavaPacks()) return;
  await setCrownedFunctions();
  await updateLoadTickIcons();
  await setNamespaceIcons();
  await setOverlayIcons();
  await setSubFolderIcons();
}

async function noJavaPacks(): Promise<boolean> {
  const mcmetaFiles = await findMcmetaInWorkspace();
  if (mcmetaFiles.length > 0) {
    return false;
  }
  return true;
}

// Set icons for functions referenced in tick.json & load.json accordingly
export async function updateLoadTickIcons() {
  const enableDynamicLoadTickChange = getConfig("dynamicFunctionIcons");
  const fileNamesIconMap: Record<string, string> = {};
  if (enableDynamicLoadTickChange) {
    const loadNames = await getReferencesFromFunctionTags("minecraft", "load");
    const tickNames = await getReferencesFromFunctionTags("minecraft", "tick");
    
    loadNames.forEach((loadName: string) => {
      fileNamesIconMap[loadName] = "mcfunction_load_file";
    });
    tickNames.forEach((tickName: string) => {
      fileNamesIconMap[tickName] = "mcfunction_tick_file";
    });

    await setThemeValue("fileNames", fileNamesIconMap);
  } else {
    const customLoadNames: string[] = getConfig("loadFunctionNames");
    const customTickNames: string[] = getConfig("tickFunctionNames");

    if (!(customLoadNames || customTickNames)) return;

    const hasCommonName = customLoadNames.some((item: string) =>
      customTickNames.includes(item),
    );

    if (hasCommonName) {
      vscode.window.showWarningMessage(
        "Naming Conflict: Tick and Load functions must be unique",
      );
      return;
    }

    const usesPartialMatch = (array: string[])=>{return array.some(item => item.includes("*"))}

    const processList = async (list: string[]) => {
      if (usesPartialMatch(list)) {
        return await getPartialMatches(list);
      }
      return list.map(item => item + ".mcfunction");
    };

    const loadFunctions = await processList(customLoadNames);
    const tickFunctions = await processList(customTickNames);

    loadFunctions?.forEach((loadName: string) => {
      fileNamesIconMap[loadName] = "mcfunction_load_file";
    });
    tickFunctions?.forEach((tickName: string) => {
      fileNamesIconMap[tickName] = "mcfunction_tick_file";
    });
    await setThemeValue("fileNames", fileNamesIconMap);
  }
  return
}

async function setCrownedFunctions() {
  let configCrownedFunctions: string[] = getConfig("crownedFunctions");
  let configCrownedLoadFunctions: string[] = getConfig("crownedLoadFunctions");
  let configCrownedTickFunctions: string[] = getConfig("crownedTickFunctions");

  const atLeastOneCrownedFunction = (
    configCrownedFunctions.length ||
    configCrownedTickFunctions.length ||
    configCrownedLoadFunctions.length
  )

  if (!atLeastOneCrownedFunction) return;

  const usesPartialMatch = (array: string[])=>{return array.some(item => item.includes("*"))}

  const processList = async (list: string[]) => {
    if (usesPartialMatch(list)) {
      return await getPartialMatches(list);
    }
    return list.map(item => item + ".mcfunction");
  };

  const fileNamesIconMap: Record<string, string> = {};

  const crownedFunctions = await processList(configCrownedFunctions);
  const crownedLoadFunctions = await processList(configCrownedLoadFunctions);
  const crownedTickFunctions = await processList(configCrownedTickFunctions);

  crownedFunctions.forEach((crownedFunction: string) => {
    fileNamesIconMap[crownedFunction] = "mcfunction_file_crowned";
  });
  crownedLoadFunctions.forEach((crownedFunction: string) => {
    fileNamesIconMap[crownedFunction] = "mcfunction_load_file_crowned";
  });
  crownedTickFunctions.forEach((crownedTickFunction: string) => {
    fileNamesIconMap[crownedTickFunction] = "mcfunction_tick_file_crowned";
  });

  await setThemeValue("fileNames", fileNamesIconMap);
}

async function setNamespaceIcons() {
  const namespaceIcons = getConfig("namespaceIcons");

  if (!namespaceIcons) return;

  let namespacePaths: string[] = await getNamespacePaths() || [];

  const namespaceNames = namespacePaths.map((fullPath) => {
    const pathSegments = fullPath.split(path.sep);
    return path.join(...pathSegments.slice(-2)).replace(/\\/g, "/");
  })

  const folderNamesIconsMap: Record<string, string> = {};
  const folderNamesExpandedIconsMap: Record<string, string> = {};

  const namespaceIcon = "namespace_folder_closed";
  const namespaceIconExpanded = "namespace_folder";

  namespaceNames.forEach((namespace: string) => {
    folderNamesIconsMap[namespace] = namespaceIcon;
    folderNamesExpandedIconsMap[namespace] = namespaceIconExpanded;
  });
  await setThemeValue("folderNames", folderNamesIconsMap);
  await setThemeValue("folderNamesExpanded", folderNamesExpandedIconsMap);
}

async function setOverlayIcons() {
  const overlayIcons = getConfig("overlayIcons");

  if (!overlayIcons) return;

  const overlayPaths: string[] = await getOverlayPaths() || [];

  const folderNamesIconsMap: Record<string, string> = {};
  const folderNamesExpandedIconsMap: Record<string, string> = {};

  const overlayIcon = "overlay_folder_closed";
  const overlayIconExpanded = "overlay_folder";

  overlayPaths.forEach((overlayPath: string) => {
    folderNamesIconsMap[overlayPath] = overlayIcon;
    folderNamesExpandedIconsMap[overlayPath] = overlayIconExpanded;
  });

  await setThemeValue("folderNames", folderNamesIconsMap);
  await setThemeValue("folderNamesExpanded", folderNamesExpandedIconsMap);
}

// Change icons of files in subfolders
async function setSubFolderIcons() {
  const subfolderIconEnabled = getConfig("subfolderIcons");
  if (!subfolderIconEnabled) return;
  const subfolderToFilesMap = (await subfolderReference()) || {};
  const subfolderFilesToIconsMap: Record<string, string> = {};

  Object.entries(subfolderToFilesMap).forEach(([key, value]) => {
    value.forEach((fileName: string) => {
      const fileIcon = subfolderIconMap[key];
      subfolderFilesToIconsMap[fileName] = fileIcon;
    });
  });
  await setThemeValue("fileNames", subfolderFilesToIconsMap);
}

/**
 * @returns {Array} of overlay paths
 */
async function getOverlayPaths(): Promise<string[]> {
  const mcmetaPaths = await findMcmetaInWorkspace()
  const packPaths = mcmetaPaths.map(p => p.replace("pack.mcmeta", ""));
  const validOverlayPaths: string[] = [];

  for (const packPath of packPaths) {
    if (!await pathExists(packPath)) continue;

    const itemsWithinPack = await workspace.fs.readDirectory(vscode.Uri.file(packPath));

    for (const item of itemsWithinPack) {
      const entryName = item[0]; // name
      const entryType = item[1]; // type
      if (entryType === vscode.FileType.Directory) {
        const subDirPath = path.join(packPath, entryName);
        
        const hasData = await pathExists(path.join(subDirPath, "data"));
        const hasAssets = await pathExists(path.join(subDirPath, "assets"));

        if (hasData !== hasAssets) {
          const pathSegments = subDirPath.split(path.sep);
          const validPath = path.join(...pathSegments.slice(-2)).replace(/\\/g, "/");
          validOverlayPaths.push(validPath);
        }
      }
    }
  }
  return validOverlayPaths;
}

/**
 * @returns {Array} of namespace paths
 */
async function getNamespacePaths(): Promise<string[]> {
  const mcmetaPaths = await findMcmetaInWorkspace()
  const packPaths = mcmetaPaths.map(p => p.replace("pack.mcmeta", ""));

  if (!packPaths) return [];

  const namespacePaths: string[] = [];

  const getPaths = async (directory: string): Promise<string[]> => { 
    if (!await pathExists(directory)) return [];
    const entries = await workspace.fs.readDirectory(vscode.Uri.file(directory));

    return entries
      .filter((entry: [string, vscode.FileType]) => entry[1] === vscode.FileType.Directory)
      .map(entry => path.join(directory, entry[0]));
  };

  for (const packPath of packPaths) {
    try {
      const assetsPaths = await getPaths(path.join(packPath, "assets"));
      namespacePaths.push(...assetsPaths);
      const dataPaths = await getPaths(path.join(packPath, "data"));
      namespacePaths.push(...dataPaths);
    } catch (error) {
      console.error(`Error reading folder: ${packPath}data`, error);
    }
  }

  return namespacePaths;
}

/**
 * @returns {Object} mapping each subfolder to an array of files located within its subsubfolders.
 */
async function subfolderReference(): Promise<{ [key: string]: string[] }> {
  const subfolders: { [key: string]: string[] } = {};
  const namespacePaths = await getNamespacePaths();
  let filesAmount = 0;

  for (const namespacePath of namespacePaths) {
    const namespaceFolderPath = path.join(namespacePath);

    if (await pathExists(namespaceFolderPath)) {
      const entries = await workspace.fs.readDirectory(vscode.Uri.file(namespaceFolderPath));
      for (const entry of entries) {
        const entryName = entry[0]; // name
        const entryType = entry[1]; // type
        const properDirectory =
          entryType === vscode.FileType.Directory && entryName in subfolderIconMap;

        if (properDirectory) {
          const subfolderPath = path.join(namespaceFolderPath, entryName);
          const files = await getFilesInDirectory(subfolderPath);
          filesAmount += files.length;

          if (subfolders[entryName]) {
            subfolders[entryName].push(...files);
          } else {
            subfolders[entryName] = files;
          }
        }
      }
    }
  }

  if (filesAmount >= 2000) warnAboutTooManyFiles();
  return subfolders;
}

/**
 * @returns {Array} of pack.mcmeta paths in this workspace
 */
async function findMcmetaInWorkspace(): Promise<string[]> {
  let mcmetaPaths: string[] = [];
  const directories =
    workspace.workspaceFolders?.map((folder) => folder.uri.fsPath) || [];

  for (const directory of directories) {
    mcmetaPaths = mcmetaPaths.concat(await findMcmetaInDirectory(directory));
  }

  return mcmetaPaths;
}

/**
 * @returns {Array} of pack.mcmeta paths in specified directory
 */
async function findMcmetaInDirectory(directory: string): Promise<string[]> {
  const dirUri = vscode.Uri.file(directory);
  const entries = await workspace.fs.readDirectory(dirUri);
  let mcmetaPaths: string[] = [];

  for (const entry of entries) {
    const entryName = entry[0]; // name
    const entryType = entry[1]; // type
    const filePath = path.join(directory, entryName);

    if (entryType === vscode.FileType.Directory) {
      mcmetaPaths = mcmetaPaths.concat(await findMcmetaInDirectory(filePath));
    } else if (entryName === "pack.mcmeta") {
      mcmetaPaths.push(filePath);
    }
  }

  return mcmetaPaths;
}
