import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import {
  setThemeValue,
  getFilesInDirectory,
  warnAboutTooManyFiles,
  getConfig,
  namespacedToFileName,
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

// This function is called in extension.ts
export function update() {
  if (noJavaPacks()) return;
  setTimeout(()=>{
    updateLoadTickIcons();
    setCrownedFunctions();
  }, 50);
  setNamespaceIcons();
  setSubFolderIcons();
}

function noJavaPacks(): boolean {
  const mcmetaFiles = findMcmetaInWorkspace();
  if (mcmetaFiles.length > 0) {
    return false;
  }
  return true;
}

// Set icons for functions referenced in tick.json | load.json accordingly
export async function updateLoadTickIcons() {
  const enableDynamicLoadTickChange = getConfig("enableLoadTickAutoChange");
  if (enableDynamicLoadTickChange) {
    const [loadNames, tickNames] = (await getTickLoadNames()) || [];
    loadNames?.forEach((loadName: string) => {
      setThemeValue(["fileNames", loadName], "mcf_load");
    });
    tickNames?.forEach((tickName: string) => {
      setThemeValue(["fileNames", tickName], "mcf_tick");
    });
  } else {
    const customLoadNames: string[] = getConfig("functionNamesForLoad");
    const customTickNames: string[] = getConfig("functionNamesForTick");

    const hasCommonName = customLoadNames?.some((item: string) =>
      customTickNames?.includes(item),
    );

    if (hasCommonName) {
      vscode.window.showWarningMessage(
        "You have same names in custom tick / load icons configuration",
      );
      return;
    }

    const hasStar = (array: string[])=>{return array.some(item => item.includes("*"))}

    if (hasStar(customLoadNames) || hasStar(customTickNames)) {
      const loadMatches = await getPartialMatches(customLoadNames);
      const tickMatches = await getPartialMatches(customTickNames);

      loadMatches?.forEach((loadName: string) => {
        setThemeValue(["fileNames", loadName], "mcf_load");
      });
      tickMatches?.forEach((tickName: string) => {
        setThemeValue(["fileNames", tickName], "mcf_tick");
      });
    } else {
      customLoadNames?.forEach((loadName: string) => {
        setThemeValue(["fileNames", loadName + ".mcfunction"], "mcf_load");
      });
      customTickNames?.forEach((tickName: string) => {
        setThemeValue(["fileNames", tickName + ".mcfunction"], "mcf_tick");
      });
    }
  }
  return
}

async function setCrownedFunctions() {
  const crownedFunctions: string[] = getConfig("crownedFunctions");
  const crownedTickFunctions: string[] = getConfig("crownedTickFunctions");
  const crownedLoadFunctions: string[] = getConfig("crownedLoadFunctions");

  const atLeastOneCrownedFunction = crownedFunctions.length || crownedTickFunctions.length || crownedLoadFunctions.length;

  if (!atLeastOneCrownedFunction) return;

  const hasStar = (array: string[])=>{return array.some(item => item.includes("*"))}

  if (hasStar(crownedFunctions) || hasStar(crownedTickFunctions) || hasStar(crownedLoadFunctions)) {
    const crownedMatches = await getPartialMatches(crownedFunctions);
    const crownedLoadMatches = await getPartialMatches(crownedLoadFunctions);
    const crownedTickMatches = await getPartialMatches(crownedTickFunctions);


    crownedMatches?.forEach((crownedFunction: string) => {
      console.log("crowned matches: " + crownedFunction)
      setThemeValue(["fileNames", crownedFunction], "mcf_main");
    });
    crownedLoadMatches?.forEach((crownedFunction: string) => {
      setThemeValue(["fileNames", crownedFunction], "mcf_main_load");
    });
    crownedTickMatches?.forEach((crownedFunction: string) => {
      setThemeValue(["fileNames", crownedFunction], "mcf_main_tick");
    });
  } else {
    crownedFunctions?.forEach((crownedFunction: string) => {
      setThemeValue(["fileNames", crownedFunction + ".mcfunction"], "mcf_main");
    });
    crownedLoadFunctions?.forEach((crownedFunction: string) => {
      setThemeValue(["fileNames", crownedFunction + ".mcfunction"], "mcf_main_load");
    });
    crownedTickFunctions?.forEach((crownedTickFunction: string) => {
      setThemeValue(["fileNames", crownedTickFunction + ".mcfunction"], "mcf_main_tick");
    });
  }
}

async function setNamespaceIcons() {
  const enableNamespaceIcons = getConfig("enableNamespaceIcons");

  if (!enableNamespaceIcons) return;

  let namespacePaths: string[] = getNamespacePaths() || [];
  const namespaceNames = namespacePaths.map((fullPath) => {
    const pathSegments = fullPath.split(path.sep);
    return path.join(...pathSegments.slice(-1)).replace(/\\/g, "/");
  });
  const folderNamesIconsMap: Record<string, string> = {};
  const folderNamesExpandedIconsMap: Record<string, string> = {};

  const namespaceIcon = "namespace";
  const namespaceIconExpanded = "namespace_open";

  namespaceNames.forEach((namespace: string) => {
    folderNamesIconsMap[namespace] = namespaceIcon;
    folderNamesExpandedIconsMap[namespace] = namespaceIconExpanded;
  });
  setThemeValue("folderNames", folderNamesIconsMap);
  setThemeValue("folderNamesExpanded", folderNamesExpandedIconsMap);
}

// Change icons of files in subfolders
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
 * @returns {Array} of load function names and {Array} of tick function names
 */
async function getTickLoadNames(): Promise<[string[], string[]]> {
  const tickReference = await vscode.workspace.findFiles(
    "**/tick.json",
    "**/node_modules/**",
  );
  const loadReference = await vscode.workspace.findFiles(
    "**/load.json",
    "**/node_modules/**",
  );
  if (tickReference?.length > 0 || loadReference?.length > 0) {
    let loadNames: string[] = [];
    let tickNames: string[] = [];
    for (let i = 0; i < loadReference.length; i++) {
      let loadValue = await namespacedToFileName(loadReference[i]);
      loadNames = [...loadNames, ...loadValue];
    }
    for (let i = 0; i < tickReference.length; i++) {
      let tickValue = await namespacedToFileName(tickReference[i]);
      tickNames = [...tickNames, ...tickValue];
    }
    return [loadNames, tickNames];
  } else {
    return [[], []];
  }
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
  const getPaths = (path: string): string[] => {
    if (!fs.existsSync(path)) return [];
    return fs
      .readdirSync(path)
      .filter((file) => fs.statSync(`${path}/${file}`).isDirectory())
      .map((file) => `${path}/${file}`);
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

/**
 * @returns two arrays with partially matched load and tick function names
 */
async function getPartialMatches(customNames: string[]): Promise<string[]> {
  const processNames = async (names: string[]): Promise<string[]> => {
    const urisArrays = await Promise.all(
      names.map((name) => vscode.workspace.findFiles(`**/${name}.mcfunction`))
    );

    const fileNames: string[] = urisArrays.flat().map((uri: vscode.Uri) => {
        const normalizedPath: string = uri.fsPath.replaceAll("\\", "/");
        
        return normalizedPath.split("/").pop() || "";
    });

    return fileNames
  };

  const nameMatches = await processNames(customNames);

  return nameMatches;
}
