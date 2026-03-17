import * as path from "path";
import * as fs from "fs/promises";
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
  // Bedrock behavior packs
  animation_controllers: "animations_file",
  animations: "animations_file",
  blocks: "blocks_file",
  cameras: "cameras_file",
  dialogue: "chat_type_file",
  entities: "entities_file",
  features: "features_file",
  feature_rules: "features_file",
  items: "items_file",
  loot_tables: "loot_table_file",
  recipes: "recipe_file",
  spawn_rules: "spawn_rules_file",
  trading: "trading_file",
  worldgen: "worldgen_file",
  // Bedrock resource packs
  attachables: "attachables_file",
  block_culling: "block_culling_file",
  entity: "entities_file",
  fogs: "fogs_file",
  font: "font_file",
  models: "models_file",
  particles: "particles_file",
  render_controllers: "render_controllers_file",
  ui: "ui_file",
};

// This function is called in extension.ts
export async function update() {
  if (await noBedrockPacks()) return;
  await updateTickIcons();
  await setSubFolderIcons();
}

async function noBedrockPacks(): Promise<boolean> {
  const manifestFiles = await findManifestInWorkspace();
  if (manifestFiles.length > 0) {
    return false;
  }
  return true;
}

// Set icons for functions referenced in tick.json
export async function updateTickIcons() {
  const enableDynamicTickChange = getConfig("enableLoadTickAutoChange");
  if (enableDynamicTickChange) {
    const tickNames = await getReferencesFromFunctionTags("minecraft", "tick");
    const fileNamesIconMap: Record<string, string> = {};
    tickNames?.forEach((tickName: string) => {
      fileNamesIconMap[tickName] = "mcfunction_tick_file";
    });
    setThemeValue("fileNames", fileNamesIconMap);
  } else {
    const customTickNames = getConfig("functionNamesForTick");

    if (!customTickNames) return;

    const usesPartialMatch = (array: string[])=>{return array.some(item => item.includes("*"))}

    const processList = async (list: string[]) => {
      if (usesPartialMatch(list)) {
        return await getPartialMatches(list);
      }
      return list.map(item => item + ".mcfunction");
    };

    const fileNamesIconMap: Record<string, string> = {};

    const tickFunctions = await processList(customTickNames);

    tickFunctions?.forEach((tickName: string) => {
      fileNamesIconMap[tickName] = "mcfunction_tick_file";
    });
    setThemeValue("fileNames", fileNamesIconMap);
  }
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
 * @returns Array of namespace paths
 */
async function getRootPaths(): Promise<string[]> {
  const manifestPaths = await findManifestInWorkspace();
  const packPaths = manifestPaths.map(p => p.replace("manifest.json", ""));

  if (!packPaths) return [];
  return packPaths;
}

/**
 * @returns {Object} mapping each subfolder to an array of files located within its subsubfolders.
 */
async function subfolderReference(): Promise<{ [key: string]: string[] }> {
  const subfolders: { [key: string]: string[] } = {};
  const rootPaths = await getRootPaths();
  let filesAmount = 0;

  for (const rootPath of rootPaths) {
    const entries = await fs.readdir(rootPath, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const properDirectory =
        entry.isDirectory() && entry.name in subfolderIconMap;

      if (properDirectory) {
        const subfolderPath = path.join(rootPath, entry.name);
        const files = await getFilesInDirectory(subfolderPath);
        filesAmount += files.length;

        if (subfolders[entry.name]) {
          subfolders[entry.name].push(...files);
        } else {
          subfolders[entry.name] = files;
        }
      }
    }
  }

  if (filesAmount >= 2000) warnAboutTooManyFiles();

  return subfolders;
}

/**
 * @returns Array of manifest.json paths in this workspace
 */
async function findManifestInWorkspace(): Promise<string[]> {
  let manifestPaths: string[] = [];
  const directories =
    workspace.workspaceFolders?.map((folder) => folder.uri.fsPath) || [];

  for (const directory of directories) {
    manifestPaths = manifestPaths.concat(await findManifestInDirectory(directory));
  }

  return manifestPaths;
}

/**
 * @returns Array of mainfest.json paths in specified directory
 */
async function findManifestInDirectory(directory: string): Promise<string[]> {
  const files = await fs.readdir(directory, { withFileTypes: true });
  let manifestPaths: string[] = [];

  for (const fileName of files) {
    const filePath = path.join(directory, fileName.name);

    if (fileName.isDirectory()) {
      manifestPaths = manifestPaths.concat(await findManifestInDirectory(filePath));
    } else if (fileName.name === "manifest.json") {
      manifestPaths.push(filePath);
    }
  }

  return manifestPaths;
}
