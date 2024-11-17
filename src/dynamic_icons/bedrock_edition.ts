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
  // Bedrock behavior packs
  animation_controllers: "animations_file",
  animations: "animations_file",
  blocks: "blocks_file",
  cameras: "cameras_file",
  entities: "entities_file",
  features: "features_file",
  feature_rules: "features_file",
  dialogue: "chat_type_file",
  trading: "trading_file",
  // Bedrock resource packs
  attachables: "attachables_file",
  entity: "entities_file",
  fogs: "fogs_file",
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
    const tickNames = (await getTickNames()) || [];
    tickNames?.forEach((tickName: string) => {
      setThemeValue(["fileNames", tickName], "mcf_tick");
    });
  } else {
    const customTickNames = getConfig("functionNamesForTick");
    customTickNames?.forEach((tickName: string) => {
      setThemeValue(["fileNames", tickName + ".mcfunction"], "mcf_tick");
    });
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
 * @returns Array of tick function names
 */
async function getTickNames(): Promise<string[]> {
  const tickReference = await vscode.workspace.findFiles(
    "**/tick.json",
    "**/node_modules/**",
  );
  if (tickReference?.length > 0) {
    let tickNames: string[] = [];
    for (let i = 0; i < tickReference.length; i++) {
      let tickValue = await namespacedToFileName(tickReference[i]);
      tickNames = [...tickNames, ...tickValue];
    }
    return tickNames;
  } else {
    return [];
  }
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
