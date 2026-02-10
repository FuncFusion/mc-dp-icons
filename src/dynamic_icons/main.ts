import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs/promises";
import * as bedrock from "./bedrock_edition";
import * as java from "./java_edition";
import { workspace } from "vscode";

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
  applyFolderArrowsSettings();
  java.update();
  bedrock.update();
}

async function resetIconDefinitions() {
  const enableChristmasIcons = getConfig("enableChristmasIcons");
  const shouldUseChristmasIcons = () => {
    if (enableChristmasIcons === "Always") {
      return true;
    } else if (enableChristmasIcons === "Only on Christmas") {
      return isChristmas();
    } else if (enableChristmasIcons === "Disable") {
      return false;
    }
  };

  if (!shouldUseChristmasIcons()) {
    fs.copyFile(defaultThemePath, themePath);
  } else {
    fs.copyFile(christmasThemePath, themePath);
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
    const data = await fs.readFile(themePath, "utf8");
    const theme = JSON.parse(data);

    const isObject = (val: any) => val !== null && typeof val === "object";

    if (isObject(value) && isObject(theme[key])) {
      theme[key] = { ...value, ...theme[key] };
    } else {
      theme[key] = value;
    }

    fs.writeFile(themePath, JSON.stringify(theme, null, 2), "utf8");
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
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name == 'node_modules') continue;

      const fullPath = path.join(dir, entry.name);
      const newPath = path.join(relativePath, entry.name).replace(/\\/g, "/");
      const validSubfolderFile =
        newPath.split("/").length > 1 &&
        newPath.endsWith(".json") &&
        !excludedFiles.some((file) => newPath.includes(file));
      const fileInSubfolder = validSubfolderFile;

      if (entry.isDirectory()) {
        collectFiles(fullPath, newPath);
      } else if (fileInSubfolder) {
        const shortenedPath =
          newPath.split("/").length > 2
            ? newPath.split("/").slice(-2).join("/")
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
        changeConfigGlobal("enableSubfolderIcons", false);
      } else if (selection === "Disable in Workspace") {
        changeConfigWorkspace("enableSubfolderIcons", false);
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
    const data = await fs.readFile(functionTagFile.fsPath, "utf8");
    const functionTag: { values: string[] } = JSON.parse(data);

    if (!functionTag.values.length) continue;

    for (const functionID of functionTag.values) {
      const functionPath: string = "function" + path.sep + functionID.split(":")[1];
      const shortenedPath = functionPath.split(path.sep).slice(-2).join(path.sep);
      functionReferences.push(`${shortenedPath}.mcfunction`);
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

export async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}
