import * as vscode from "vscode";
import * as bedrock from "./bedrockEdition";
import * as java from "./javaEdition";
import { Utils } from 'vscode-uri';
import { config } from "../configuration/configManager"
import { baseTheme } from "../data/baseTheme"
import { ThemeBuilder } from "../theme/themeBuilder"
import { workspaceDetection } from "./workspace"
import { logger } from "../common/logger"

export function normalizePath(path: string): string {
  return path.replace(/\\/g, "/");
}

export let extensionUri: vscode.Uri;

export function setExtensionUri(uri: vscode.Uri) {
  extensionUri = uri;
}

export async function update() {
  logger.debug("Starting theme update")

  await workspaceDetection();

  const activePath = Utils.joinPath(extensionUri, "icon_theme", "active.json").fsPath;

  const builder = new ThemeBuilder(baseTheme)

  const javaResult = await java.update()
  logger.debug("Java results:", Object.keys(javaResult.fileNames).length, "file names,", Object.keys(javaResult.folderNamesExpanded).length, "folder names")
  builder.addFileNames(javaResult.fileNames)
  builder.addFolders(javaResult.folderNamesExpanded)

  const bedrockResult = await bedrock.update()
  logger.debug("Bedrock results:", Object.keys(bedrockResult.fileNames).length, "file names")
  builder.addFileNames(bedrockResult.fileNames)

  const confHideFolderArrows = config.get("hideFolderArrows")
  if (confHideFolderArrows) {
    builder.setHidesExplorerArrows(true)
  }

  builder.write(activePath)
  logger.debug("Theme written to", activePath)
}
