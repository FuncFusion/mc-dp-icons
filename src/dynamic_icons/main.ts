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
  "fileicons",
  "mc-dp-icon-theme.json",
);
const christmasThemePath = path.join(
  __dirname,
  "..",
  "..",
  "fileicons",
  "mc-dp-icon-theme-xmas.json",
);
const defaultThemePath = path.join(
  __dirname,
  "..",
  "..",
  "fileicons",
  "mc-dp-icon-theme-default.json",
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
export async function setThemeValue(keyName: string | string[], value: any) {
  let themeContent = fs.readFileSync(themePath, "utf8");
  let themeObject = JSON.parse(themeContent);
  const isObject = (obj: any) => obj === Object(obj);
  let currentKey = themeObject;
  const setValue = (key: string, value: any) => {
    if (isObject(value)) {
      currentKey[key] = {
        ...currentKey[key],
        ...value,
      };
    } else {
      currentKey[key] = value;
    }
  };

  if (Array.isArray(keyName)) {
    const lastKey = keyName[keyName.length - 1];

    keyName.forEach((key) => {
      if (key === lastKey) {
        setValue(key, value);
      } else {
        currentKey[key] || {};
        currentKey = currentKey[key];
      }
    });
  } else {
    setValue(keyName, value);
  }
  fs.writeFileSync(themePath, JSON.stringify(themeObject, null, 2), "utf8");
}

export const readFile = util.promisify(fs.readFile);

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
 * Convert function id inside function tag file to filename
 * @param file - Function tag file
 */
export async function namespacedToFileName(
  file: vscode.Uri,
): Promise<string[]> {
  const filePath = file.fsPath;
  const removeNamespace = (input: string) => {
    return input.split(":")[1];
  };

  try {
    const fileContent = await readFile(filePath, "utf8");
    const fileObject = JSON.parse(fileContent);
    const functionNotReferenced = fileObject.values?.length == 0;

    if (functionNotReferenced) return [];

    return fileObject.values.map(
      (value: string) => `${removeNamespace(value)}.mcfunction`,
    );
  } catch (err) {
    console.error(`Failed to read tick.json || load.json: ${err}`);
    return [];
  }
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
