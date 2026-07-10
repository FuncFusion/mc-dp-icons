import * as vscode from "vscode"
import { getConfig } from "../../configuration/configManager"
import { getOverlayPaths } from "./helpers/getOverlayPaths"

export async function getOverlayFolders(mcmetaFiles: vscode.Uri[]): Promise<Record<string, string>> {
  const overlayIcons = getConfig("overlayIcons")
  if (!overlayIcons) {
    return {}
  }

  const overlayPaths = await getOverlayPaths(mcmetaFiles)

  const folderNames: Record<string, string> = {}
  overlayPaths.forEach(function(overlayPath) {
    folderNames[overlayPath] = "overlay_folder"
  })

  return folderNames
}
