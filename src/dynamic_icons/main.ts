import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import util from "util";
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
export function update() {
  resetIconDefinitions();
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
    fs.copyFileSync(defaultThemePath, themePath);
  } else {
    fs.copyFileSync(christmasThemePath, themePath);
  }
}

async function applyFolderArrowsSettings() {
  const confHideFolderArrows = getConfig("hideFolderArrows");
  if (confHideFolderArrows) {
    setThemeValue("hidesExplorerArrows", true);
  } else {
    setThemeValue("hidesExplorerArrows", false);
  }
}

/**
 * Sets a nested key's value within the theme configuration.
 * @param keys - A string or array of strings representing the key path (e.g., "key" or ["key1", "key2"]).
 * @param value - The value to set at the specified key path.
 */
export function setThemeValue(key: string, value: any) {
  const theme = JSON.parse(fs.readFileSync(themePath, "utf8"));
  const isObject = (val: any) => val !== null && typeof val === "object";

  if (isObject(value) && isObject(theme[key])) {
    theme[key] = { ...value, ...theme[key] };
  } else {
    theme[key] = value;
  }

  fs.writeFileSync(themePath, JSON.stringify(theme, null, 2), "utf8");
}

/**
 * Helper function to retrieve all files in a directory and its subdirectories
 * @param directory - The directory you're retrieving all of the files from
 * @returns {Array} of files located within the directory
 */
export function getFilesInDirectory(directory: string): string[] {
  const files: string[] = [];
  const excludedFiles = [
    "function/load.json",
    "function/tick.json",
    "functions/load.json",
    "functions/tick.json",
  ];
  const collectFiles = (dir: string, relativePath = "") => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach((entry) => {
      if (entry.name.startsWith('.') || entry.name == 'node_modules') {
        return;
      }
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
    });
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

  functionTagFiles.forEach(functionTagFile => {
    const functionTag: { values: string[] } = JSON.parse(fs.readFileSync(functionTagFile.fsPath, "utf8"));

    if (!functionTag.values.length) return;

    functionTag.values.forEach((functionID: string) => {
      const functionName: string = functionID.split(":")[1];
      functionReferences.push(`${functionName}.mcfunction`);
    });
  });

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

/** @returns True if current date is between 24 and 26 December inclusive */
export function isChristmas() {
  const now = new Date();
  return now.getMonth() === 11 && now.getDate() >= 24 && now.getDate() <= 26;
}
