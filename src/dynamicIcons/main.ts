import * as vscode from "vscode";
import * as bedrock from "./bedrockEdition";
import * as java from "./javaEdition";
import { Uri, workspace } from "vscode";
import { Utils } from 'vscode-uri';
import { config } from "../configuration/configManager"
import { baseTheme } from "../data/baseTheme"
import { ThemeBuilder } from "../theme/themeBuilder"

const fs = workspace.fs;

export function normalizePath(path: string): string {
  return path.replace(/\\/g, "/");
}

export let extensionUri: vscode.Uri;

export function setExtensionUri(uri: vscode.Uri) {
  extensionUri = uri;
}

export async function update() {
  await workspaceDetection();

  const activePath = Utils.joinPath(extensionUri, "icon_theme", "active.json").fsPath;

  const builder = new ThemeBuilder(baseTheme)

  const javaResult = await java.update()
  builder.addFileNames(javaResult.fileNames)
  builder.addFolders(javaResult.folderNamesExpanded)

  const bedrockResult = await bedrock.update()
  builder.addFileNames(bedrockResult.fileNames)

  const confHideFolderArrows = config.get("hideFolderArrows")
  if (confHideFolderArrows) {
    builder.setHidesExplorerArrows(true)
  }

  builder.write(activePath)
}

export async function workspaceDetection() {
  const isDetectionEnabled = config.get("workspaceDetection");
  if (!isDetectionEnabled) return;

  const isMinecraft = await isMinecraftWorkspace();

  if (isMinecraft) {
    config.changeWorkspace("workbench.iconTheme", "mc-dp-icons");
    return;
  }

  const fallbackIconTheme = config.get("fallbackIconTheme");
  if (fallbackIconTheme) {
    config.changeWorkspace("workbench.iconTheme", fallbackIconTheme);
    return;
  }

  const workbenchConfig = vscode.workspace.getConfiguration("workbench");
  const iconThemeInspection = workbenchConfig.inspect<string>("iconTheme");
  const userDefaultTheme = iconThemeInspection?.globalValue;

  config.changeWorkspace("workbench.iconTheme", userDefaultTheme);
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
      const newPath = normalizePath(Utils.joinPath(vscode.Uri.file(relativePath), entryName).fsPath);
      const pathDepth = newPath.split('/').length;

      const validSubfolderFile =
        pathDepth > 2 &&
        newPath.endsWith(".json") &&
        !excludedFiles.some((file) => newPath.includes(file));
      const fileInSubfolder = validSubfolderFile;

      if (entryType === vscode.FileType.Directory) {
        await collectFiles(fullPath, newPath);
      } else if (fileInSubfolder) {
        const shortenedPath =
          pathDepth > 2
            ? newPath.split('/').slice(-2).join('/')
            : newPath;

        files.push(shortenedPath);
      }
    }
  };
  await collectFiles(directory);
  return files;
}

export function warnAboutTooManyFiles() {
  const warningMessage = `Too many files in subsubfolders (Over 2000). Subfolder icons feature might not work properly. Would you like to disable this feature?`;

  vscode.window
    .showWarningMessage(
      warningMessage,
      { modal: false },
      "Disable Globally",
      "Disable in Workspace",
    )
    .then((selection) => {
      if (selection === "Disable Globally") {
        config.changeGlobal("mc-dp-icons.subfolderIcons", false);
      } else if (selection === "Disable in Workspace") {
        config.changeWorkspace("mc-dp-icons.subfolderIcons", false);
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
      const shortenedPath = normalizePath(functionPath).split('/').slice(-2).join('/');
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
    return normalizePath(matchedFunction.fsPath).split('/').pop() || '';
  });

  return fileNames
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

export async function findRootFiles(): Promise<Uri[]> {
  const projectRootPatterns = [
    "**/pack.mcmeta",
    "**/{beet.json,beet.yaml,beet.yml}",
  ];

  const lists = await Promise.all(
    projectRootPatterns.map(p => workspace.findFiles(p, "**/node_modules/**"))
  );

  console.log("saygex: ", lists.flat().toString())

  return lists.flat();
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
