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
export function update() {
  if (noBedrockPacks()) return;
  updateTickIcons();
  setSubFolderIcons();
}

function noBedrockPacks(): boolean {
  const manifestFiles = findManifestInWorkspace();
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
    tickNames?.forEach((tickName: string) => {
      setThemeValue(["fileNames", tickName], "mcf_tick_file");
    });
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
      fileNamesIconMap[tickName] = "mcf_tick_File";
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
function getRootPaths(): string[] {
  let packPaths = findManifestInWorkspace().map((packPath) =>
    packPath.replace("manifest.json", ""),
  );
  if (!packPaths) return [];
  return packPaths;
}

/**
 * @returns {Object} mapping each subfolder to an array of files located within its subsubfolders.
 */
async function subfolderReference(): Promise<{ [key: string]: string[] }> {
  const subfolders: { [key: string]: string[] } = {};
  const rootPaths = getRootPaths();
  let filesAmount = 0;

  rootPaths.forEach((rootPath) => {
    const entries = fs.readdirSync(rootPath, {
      withFileTypes: true,
    });
    entries.forEach((entry) => {
      const properDirectory =
        entry.isDirectory() && entry.name in subfolderIconMap;

      if (properDirectory) {
        const subfolderPath = path.join(rootPath, entry.name);
        const files = getFilesInDirectory(subfolderPath);
        filesAmount += files.length;

        if (subfolders[entry.name]) {
          subfolders[entry.name].push(...files);
        } else {
          subfolders[entry.name] = files;
        }
      }
    });
  });
  if (filesAmount >= 2000) warnAboutTooManyFiles();
  return subfolders;
}

/**
 * @returns Array of manifest.json paths in this workspace
 */
function findManifestInWorkspace(): string[] {
  let manifestPaths: string[] = [];
  const directories =
    workspace.workspaceFolders?.map((folder) => folder.uri.fsPath) || [];

  directories.forEach((directory) => {
    manifestPaths = manifestPaths.concat(findManifestInDirectory(directory));
  });

  return manifestPaths;
}

/**
 * @returns Array of mainfest.json paths in specified directory
 */
function findManifestInDirectory(directory: string): string[] {
  const files = fs.readdirSync(directory);
  let manifestPaths: string[] = [];

  files.forEach((fileName) => {
    const filePath = path.join(directory, fileName);

    if (fs.statSync(filePath).isDirectory()) {
      manifestPaths = manifestPaths.concat(findManifestInDirectory(filePath));
    } else if (fileName === "manifest.json") {
      manifestPaths.push(filePath);
    }
  });

  return manifestPaths;
}
