import * as vscode from "vscode";
import * as bedrock from "./bedrockEdition";
import * as java from "./javaEdition";
import { Uri, workspace } from "vscode";
import { Utils } from 'vscode-uri';

const fs = workspace.fs;

export let extensionUri: vscode.Uri;

export function setExtensionUri(uri: vscode.Uri) {
  extensionUri = uri;
}

let themePath = '';
let christmasThemePath = '';
let defaultThemePath = '';


export async function update() {
  themePath = Utils.joinPath(extensionUri, "file_icon_themes", "active.json").fsPath;
  christmasThemePath = Utils.joinPath(extensionUri, "file_icon_themes", "xmas.json").fsPath;
  defaultThemePath = Utils.joinPath(extensionUri, "file_icon_themes", "default.json").fsPath;
  
  await resetIconDefinitions();
  await workspaceDetection();
  applyFolderArrowsSettings();
  java.update();
  bedrock.update();
}

export async function workspaceDetection() {
  const isDetectionEnabled = getConfig("workspaceDetection");
  if (!isDetectionEnabled) return;

  const isMinecraft = await isMinecraftWorkspace();

  if (isMinecraft) {
    await changeConfigWorkspace("workbench.iconTheme", "mc-dp-icons");
    return;
  }

  const fallbackIconTheme = getConfig("fallbackIconTheme");
  if (fallbackIconTheme) {
    await changeConfigWorkspace("workbench.iconTheme", fallbackIconTheme);
    return;
  }

  const workbenchConfig = vscode.workspace.getConfiguration("workbench");
  const iconThemeInspection = workbenchConfig.inspect<string>("iconTheme");
  const userDefaultTheme = iconThemeInspection?.globalValue;

  await changeConfigWorkspace("workbench.iconTheme", userDefaultTheme);
}

async function resetIconDefinitions() {
  const christmasIcons = getConfig("christmasIcons");
  const shouldUseChristmasIcons = () => {
    if (christmasIcons === "Always") {
      return true;
    } else if (christmasIcons === "Only on Christmas") {
      return isChristmas();
    } else if (christmasIcons === "Never") {
      return false;
    }
  };

  if (!shouldUseChristmasIcons()) {
    const defaultData = await fs.readFile(vscode.Uri.file(defaultThemePath));
    await fs.writeFile(vscode.Uri.file(themePath), defaultData);
  } else {
    const christmasData = await fs.readFile(vscode.Uri.file(christmasThemePath));
    await fs.writeFile(vscode.Uri.file(themePath), christmasData);
  }
}

async function applyFolderArrowsSettings() {
  const confHideFolderArrows = getConfig("hideFolderArrows");
  if (confHideFolderArrows) {
    await setThemeValue("hidesExplorerArrows", true);
  } else {
    await setThemeValue("hidesExplorerArrows", false);
  }
}

/**
 * Sets a nested key's value within the theme configuration.
 * @param keys - A string or array of strings representing the key path (e.g., "key" or ["key1", "key2"]).
 * @param value - The value to set at the specified key path.
 */
export async function setThemeValue(key: string, value: any) {
  try {
    const data = await fs.readFile(vscode.Uri.file(themePath));
    const content = new TextDecoder().decode(data);
    const theme = JSON.parse(content);

    const isObject = (val: any) => val !== null && typeof val === "object";

    if (isObject(value) && isObject(theme[key])) {
      theme[key] = { ...value, ...theme[key] };
    } else {
      theme[key] = value;
    }

    const jsonString = JSON.stringify(theme, null, 2);
    const encodedContent = new TextEncoder().encode(jsonString);
    await fs.writeFile(vscode.Uri.file(themePath), encodedContent);
  } catch (error) {
    console.error(`Error setting theme value: ${error}`);
  }
}

/**
 * Helper function to retrieve all files in a directory and its subdirectories
 * @param directory - The directory you're retrieving all of the files from
 * @returns {Array} of files located within the directory
 */
export async function getFilesInDirectory(directory: string): Promise<string[]> {
  const files: string[] = [];
  const excludedFiles = [
    "function/load.json",
    "function/tick.json",
    "functions/load.json",
    "functions/tick.json",
  ];
  const collectFiles = async (dir: string, relativePath = "") => {
    const dirUri = vscode.Uri.file(dir);
    const entries = await fs.readDirectory(dirUri);
    for (const entry of entries) {
      const entryName = entry[0];
      const entryType = entry[1];
      if (entryName.startsWith('.') || entryName == 'node_modules') continue;

      const fullPath = Utils.joinPath(vscode.Uri.file(dir), entryName).fsPath;
      const newPath = Utils.joinPath(vscode.Uri.file(relativePath), entryName).fsPath;
      const validSubfolderFile =
        newPath.split('/').length > 1 &&
        newPath.endsWith(".json") &&
        !excludedFiles.some((file) => newPath.includes(file));
      const fileInSubfolder = validSubfolderFile;

      if (entryType === vscode.FileType.Directory) {
        collectFiles(fullPath, newPath);
      } else if (fileInSubfolder) {
        const shortenedPath =
          newPath.split('/').length > 2
            ? newPath.split('/').slice(-2).join('/')
            : newPath;

        files.push(shortenedPath);
      }
    }
  };
  collectFiles(directory);
  return files;
}

export function warnAboutTooManyFiles() {
  const warningMessage = `Too many files in subsubfolders (Over 2000). Subsubfolder icons feature might not work properly. Would you like to disable this feature?`;

  vscode.window
    .showWarningMessage(
      warningMessage,
      { modal: false },
      "Disable Globally",
      "Disable in Workspace",
    )
    .then((selection) => {
      if (selection === "Disable Globally") {
        changeConfigGlobal("subfolderIcons", false);
      } else if (selection === "Disable in Workspace") {
        changeConfigWorkspace("subfolderIcons", false);
      }
    });
}

/**
 * @returns {Array} of load function names and {Array} of tick function names
 */
export async function getReferencesFromFunctionTags(namespace: string, functionTag: string): Promise<string[]> {
  const functionTagFiles = await vscode.workspace.findFiles(
    `**/${namespace}/tags/function/**/${functionTag}.json`,
    "**/node_modules/**",
  );

  if (!functionTagFiles.length) return [];

  let functionReferences: string[] = [];

  for (const functionTagFile of functionTagFiles) {
    const data = await fs.readFile(functionTagFile);
    const content = new TextDecoder().decode(data);
    const functionTag: { values: string[] } = JSON.parse(content);

    if (!functionTag.values.length) continue;

    for (const functionID of functionTag.values) {
      const functionPath: string = "function/" + functionID.split(":")[1];
      const shortenedPath = functionPath.split('/').slice(-2).join('/');
      const forwardSlashPath = shortenedPath.replace(/\\/g, "/");
      functionReferences.push(`${forwardSlashPath}.mcfunction`);
    }
  }

  return functionReferences;
}

/**
 * @returns {Array} of partially matched function names
 */
export async function getPartialMatches(customNames: string[]): Promise<string[]> {
  const matchedFunctions = (await Promise.all(
    customNames.map((name) => vscode.workspace.findFiles(`**/${name}.mcfunction`))
  )).flat();

  const fileNames: string[] = matchedFunctions.map((matchedFunction: vscode.Uri) => {
    return matchedFunction.fsPath.split('/').pop() || '';
  });

  return fileNames
}

export function getConfig(name: string): any {
  return workspace.getConfiguration().get(`mc-dp-icons.${name}`);
}

async function changeConfigGlobal(settingName: string, value: any) {
  const config = workspace.getConfiguration();

  await config.update(
    settingName,
    value,
    vscode.ConfigurationTarget.Global
  );
}

async function changeConfigWorkspace(settingName: string, value: any) {
  const config = workspace.getConfiguration();

  await config.update(
    settingName,
    value,
    vscode.ConfigurationTarget.Workspace
  );
}

export function isChristmas() {
  const now = new Date();
  return now.getMonth() === 11 && now.getDate() >= 24 && now.getDate() <= 26;
}

export async function uriExists(uri: vscode.Uri): Promise<boolean> {
  try {
    await fs.stat(uri);
    return true;
  } catch {
    return false;
  }
}

export async function pathExists(filePath: string): Promise<boolean> {
  return await uriExists(vscode.Uri.file(filePath));
}

export async function findPackMcmeta(): Promise<Uri[]> {
    return await workspace.findFiles('**/pack.mcmeta', '**/node_modules/**');
}

async function isMinecraftWorkspace(): Promise<boolean> {
  const easyPatterns = [
    "**/pack.mcmeta",
    "**/jmc_config.json",
    "**/{beet.json,beet.yaml,beet.yml}",
  ];

  for (const pattern of easyPatterns) {
    const files = await workspace.findFiles(pattern, "**/node_modules/**");
    if (files.length > 0) {
      return true;
    }
  }

  const manifestFiles = await workspace.findFiles('**/manifest.json', '**/node_modules/**');

  for (const manifestFile of manifestFiles) {
    try {
      const manifestContent = await workspace.fs.readFile(manifestFile);
      const manifestJson = JSON.parse(manifestContent.toString());

      if ("format_version" in manifestJson) {
        return true;
      }
    } catch (error) {
      continue;
    }
  }

  return false;
}
