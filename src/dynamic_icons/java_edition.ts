import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import {
  setThemeValue,
  getFilesInDirectory,
  warnAboutTooManyFiles,
  getConfig,
  getReferencesFromFunctionTags,
  getPartialMatches,
} from "./main";
import { workspace } from "vscode";

const subfolderIconMap: Record<string, string> = {
  // Datapacks
  advancement: "advancement_file",
  advancements: "advancement_file",
  banner_pattern: "banner_pattern_file",
  damage_type: "damage_type_file",
  dimension: "dimension_file",
  dimension_type: "dimension_type_file",
  enchantment: "enchantment_file",
  enchantment_provider: "enchantment_file",
  item_modifier: "item_modifier_file",
  item_modifiers: "item_modifier_file",
  instrument: "instrument_file",
  jukebox_song: "jukebox_song_file",
  loot_table: "loot_table_file",
  loot_tables: "loot_table_file",
  painting_variant: "image",
  predicate: "predicate_file",
  predicates: "predicate_file",
  recipe: "recipe_file",
  recipes: "recipe_file",
  tags: "tags_file",
  trial_spawner: "trial_spawner_file",
  trim_material: "trim_material_file",
  trim_pattern: "trim_pattern_file",
  wolf_variant: "wolf_variant_file",
  worldgen: "worldgen_file",
  // Resourcepacks
  font: "font_file",
  items: "items_file",
  models: "models_file",
  post_effect: "shaders_file",
  shaders: "shaders_file",
};

const PRIORITY = {
  LOAD_TICK: 1,
  CROWNED: 2
};

let currentFileIcons: Record<string, string> = {};
let fileIconPriority: Record<string, number> = {};

function applyIconsWithPriority(icons: Record<string, string>, level: number) {
  for (const [file, icon] of Object.entries(icons)) {
    const existingLevel = fileIconPriority[file] || 0;

    if (level >= existingLevel) {
      currentFileIcons[file] = icon;
      fileIconPriority[file] = level;
    }
  }
  setThemeValue("fileNames", currentFileIcons);
}

export function update() {
  if (noJavaPacks()) return;
  updateLoadTickIcons();
  setCrownedFunctions();
  setNamespaceIcons();
  setOverlayIcons();
  setSubFolderIcons();
}

function noJavaPacks(): boolean {
  const mcmetaFiles = findMcmetaInWorkspace();
  if (mcmetaFiles.length > 0) {
    return false;
  }
  return true;
}

export async function updateLoadTickIcons() {
  const enableDynamicLoadTickChange = getConfig("enableLoadTickAutoChange");
  const fileNamesIconMap: Record<string, string> = {};
  if (enableDynamicLoadTickChange) {
    const loadNames = await getReferencesFromFunctionTags("minecraft", "load");
    const tickNames = await getReferencesFromFunctionTags("minecraft", "tick");
    
    loadNames.forEach((loadName: string) => {
      fileNamesIconMap[loadName] = "mcf_load_file";
    });
    tickNames.forEach((tickName: string) => {
      fileNamesIconMap[tickName] = "mcf_tick_file";
    });
    applyIconsWithPriority(fileNamesIconMap, PRIORITY.LOAD_TICK);
  } else {
    const customLoadNames: string[] = getConfig("functionNamesForLoad");
    const customTickNames: string[] = getConfig("functionNamesForTick");

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
      fileNamesIconMap[loadName] = "mcf_load_file";
    });
    tickFunctions?.forEach((tickName: string) => {
      fileNamesIconMap[tickName] = "mcf_tick_file";
    });
    applyIconsWithPriority(fileNamesIconMap, PRIORITY.LOAD_TICK);
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
    fileNamesIconMap[crownedFunction] = "mcf_file_crowned";
  });
  crownedLoadFunctions.forEach((crownedFunction: string) => {
    fileNamesIconMap[crownedFunction] = "mcf_load_file_crowned";
  });
  crownedTickFunctions.forEach((crownedTickFunction: string) => {
    fileNamesIconMap[crownedTickFunction] = "mcf_tick_file_crowned";
  });

  applyIconsWithPriority(fileNamesIconMap, PRIORITY.CROWNED);
}

async function setNamespaceIcons() {
  const enableNamespaceIcons = getConfig("enableNamespaceIcons");

  if (!enableNamespaceIcons) return;

  let namespacePaths: string[] = getNamespacePaths() || [];

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
  setThemeValue("folderNames", folderNamesIconsMap);
  setThemeValue("folderNamesExpanded", folderNamesExpandedIconsMap);
}

async function setOverlayIcons() {
  const enableOverlayIcons = getConfig("enableOverlayIcons");

  if (!enableOverlayIcons) return;

  const overlayPaths: string[] = getOverlayPaths() || [];

  const folderNamesIconsMap: Record<string, string> = {};
  const folderNamesExpandedIconsMap: Record<string, string> = {};

  const overlayIcon = "overlay_folder_closed";
  const overlayIconExpanded = "overlay_folder";

  overlayPaths.forEach((overlayPath: string) => {
    folderNamesIconsMap[overlayPath] = overlayIcon;
    folderNamesExpandedIconsMap[overlayPath] = overlayIconExpanded;
  });

  setThemeValue("folderNames", folderNamesIconsMap);
  setThemeValue("folderNamesExpanded", folderNamesExpandedIconsMap);
}

async function setSubFolderIcons() {
  const subfolderIconEnabled = getConfig("enableSubfolderIcons");
  if (!subfolderIconEnabled) return;
  const subfolderToFilesMap = (await subfolderReference()) || {};
  const subfolderFilesToIconsMap: Record<string, string> = {};

  Object.entries(subfolderToFilesMap).forEach(([key, value]) => {
    value.forEach((fileName: string) => {
      const fileIcon = subfolderIconMap[key];
      subfolderFilesToIconsMap[fileName] = fileIcon;
    });
  });
  setThemeValue("fileNames", subfolderFilesToIconsMap);
}

/**
 * @returns {Array} of overlay paths
 */
function getOverlayPaths(): string[] {
  const packPaths = findMcmetaInWorkspace().map(p => p.replace("pack.mcmeta", ""));
  const validOverlayPaths: string[] = [];

  packPaths.forEach(packPath => {
    if (!fs.existsSync(packPath)) return;

    const itemsWithinPack = fs.readdirSync(packPath, { withFileTypes: true });

    for (const item of itemsWithinPack) {
      if (item.isDirectory()) {
        const subDirPath = `${packPath}${item.name}`;
        
        const hasData = fs.existsSync(`${subDirPath}/data`);
        const hasAssets = fs.existsSync(`${subDirPath}/assets`);

        if (hasData !== hasAssets) {
          const pathSegments = subDirPath.split(path.sep);
          const validPath = path.join(...pathSegments.slice(-2)).replace(/\\/g, "/");
          validOverlayPaths.push(validPath);
        }
      }
    }
  });

  return validOverlayPaths;
}

/**
 * @returns {Array} of namespace paths
 */
function getNamespacePaths(): string[] {
  let packPaths = findMcmetaInWorkspace().map((packPath) =>
    packPath.replace("pack.mcmeta", ""),
  );
  if (!packPaths) return [];

  const namespacePaths: string[] = [];

  /** @returns {Array} of paths for every subdirectory in specified path */
  const getPaths = (directory: string): string[] => {
    if (!fs.existsSync(directory)) return [];
    return fs
      .readdirSync(directory)
      .filter((file) => fs.statSync(`${directory}${path.sep}${file}`).isDirectory())
      .map((file) => `${directory}${path.sep}${file}`);
  };

  packPaths.forEach((packPath) => {
    try {
      namespacePaths.push(...getPaths(packPath + "data"));
      namespacePaths.push(...getPaths(packPath + "assets"));
    } catch (error) {
      console.error(`Error reading folder: ${packPath}data`, error);
    }
  });

  return namespacePaths;
}

/**
 * @returns {Object} mapping each subfolder to an array of files located within its subsubfolders.
 */
async function subfolderReference(): Promise<{ [key: string]: string[] }> {
  const subfolders: { [key: string]: string[] } = {};
  const namespacePaths = getNamespacePaths();
  let filesAmount = 0;

  namespacePaths.forEach((namespacePath) => {
    const namespaceFolderPath = path.join(namespacePath);

    if (fs.existsSync(namespaceFolderPath)) {
      const entries = fs.readdirSync(namespaceFolderPath, {
        withFileTypes: true,
      });
      entries.forEach((entry) => {
        const properDirectory =
          entry.isDirectory() && entry.name in subfolderIconMap;

        if (properDirectory) {
          const subfolderPath = path.join(namespaceFolderPath, entry.name);
          const files = getFilesInDirectory(subfolderPath);
          filesAmount += files.length;

          if (subfolders[entry.name]) {
            subfolders[entry.name].push(...files);
          } else {
            subfolders[entry.name] = files;
          }
        }
      });
    }
  });
  if (filesAmount >= 2000) warnAboutTooManyFiles();
  return subfolders;
}

/**
 * @returns {Array} of pack.mcmeta paths in this workspace
 */
function findMcmetaInWorkspace(): string[] {
  let mcmetaPaths: string[] = [];
  const directories =
    workspace.workspaceFolders?.map((folder) => folder.uri.fsPath) || [];

  directories.forEach((directory) => {
    mcmetaPaths = mcmetaPaths.concat(findMcmetaInDirectory(directory));
  });

  return mcmetaPaths;
}

/**
 * @returns {Array} of pack.mcmeta paths in specified directory
 */
function findMcmetaInDirectory(directory: string): string[] {
  const files = fs.readdirSync(directory);
  let mcmetaPaths: string[] = [];

  files.forEach((fileName) => {
    const filePath = path.join(directory, fileName);

    if (fs.statSync(filePath).isDirectory()) {
      mcmetaPaths = mcmetaPaths.concat(findMcmetaInDirectory(filePath));
    } else if (fileName === "pack.mcmeta") {
      mcmetaPaths.push(filePath);
    }
  });

  return mcmetaPaths;
}
