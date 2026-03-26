import * as vscode from "vscode";
import * as path from "path";
import * as bedrock from "./bedrockEdition";
import * as java from "./javaEdition";
import { Uri, workspace } from "vscode";

const fs = workspace.fs;
const defaultIconTheme: string | undefined = undefined;

export const themePath = path.join(
  __dirname,
  "..",
  "..",
  "file_icon_themes",
  "active.json",
);
const christmasThemePath = path.join(
  __dirname,
  "..",
  "..",
  "file_icon_themes",
  "xmas.json",
);
const defaultThemePath = path.join(
  __dirname,
  "..",
  "..",
  "file_icon_themes",
  "default.json",
);

// This function is called in extension.ts
export async function update() {
  await resetIconDefinitions();
  workspaceDetection();
  applyFolderArrowsSettings();
  java.update();
  bedrock.update();
}

async function workspaceDetection() {
  const workspaceDetection = getConfig("workspaceDetection");
  if (!workspaceDetection) return;

  if (await isMinecraftWorkspace()) {
      await updateWorkbenchIconTheme("mc-dp-icons");
  } else {
    const iconTheme = getConfig("fallbackIconTheme") || defaultIconTheme;
    await updateWorkbenchIconTheme(iconTheme);
  }
}

async function updateWorkbenchIconTheme(themeId: string | undefined) {
  if (!themeId) return;
  await vscode.workspace.getConfiguration('workbench')
      .update('iconTheme', themeId, vscode.ConfigurationTarget.Workspace);
}

async function resetIconDefinitions() {
  const christmasIcons = getConfig("christmasIcons");
  const shouldUseChristmasIcons = () => {
    if (christmasIcons === "Always") {
      return true;
    } else if (christmasIcons === "Only on Christmas") {
      return isChristmas();
    } else if (christmasIcons === "Disable") {
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
      const entryName = entry[0]; // name
      const entryType = entry[1]; // type
      if (entryName.startsWith('.') || entryName == 'node_modules') continue;

      const fullPath = path.join(dir, entryName);
      const newPath = path.join(relativePath, entryName);
      const validSubfolderFile =
        newPath.split(path.sep).length > 1 &&
        newPath.endsWith(".json") &&
        !excludedFiles.some((file) => newPath.includes(file));
      const fileInSubfolder = validSubfolderFile;

      if (entryType === vscode.FileType.Directory) {
        collectFiles(fullPath, newPath);
      } else if (fileInSubfolder) {
        const shortenedPath =
          newPath.split(path.sep).length > 2
            ? newPath.split(path.sep).slice(-2).join(path.sep)
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
      const functionPath: string = "function" + path.sep + functionID.split(":")[1];
      const shortenedPath = functionPath.split(path.sep).slice(-2).join(path.sep);
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
    return path.basename(matchedFunction.fsPath);
  });

  return fileNames
}

export function getConfig(name: string): any {
  return workspace.getConfiguration().get(`mc-dp-icons.${name}`);
}

function changeConfigGlobal(name: string, value: any) {
  return workspace
    .getConfiguration()
    .update(`mc-dp-icons.${name}`, value, vscode.ConfigurationTarget.Global);
}

function changeConfigWorkspace(name: string, value: any) {
  return workspace
    .getConfiguration()
    .update(`mc-dp-icons.${name}`, value, vscode.ConfigurationTarget.Workspace);
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
  const mcmetaFiles = await findPackMcmeta();

  if (mcmetaFiles.length > 0) {
    return true;
  }

  const beetFiles = await workspace.findFiles('**/{beet.json,beet.yaml,beet.yml}', '**/node_modules/**');

  if (beetFiles.length > 0) {
    return true;
  }

  const manifestFiles = await workspace.findFiles('**/manifest.json', '**/node_modules/**');

  if (manifestFiles.length > 0) {
    for (const manifestFile of manifestFiles) {
      const manifestContent = await workspace.fs.readFile(manifestFile);
      const manifestJson = JSON.parse(manifestContent.toString());

      if ("format_version" in manifestJson) {
        break;
      }
    }

    return true;
  }

  return false;
}
