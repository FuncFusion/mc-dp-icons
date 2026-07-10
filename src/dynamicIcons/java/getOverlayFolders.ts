import { getConfig } from "../../configuration/configManager"
import { getOverlayPaths } from "./helpers/getOverlayPaths"

export async function getOverlayFolders(): Promise<Record<string, string>> {
  const overlayIcons = getConfig("overlayIcons")
  if (!overlayIcons) {
    return {}
  }

  const overlayPaths = await getOverlayPaths()

  const folderNames: Record<string, string> = {}
  overlayPaths.forEach(function(overlayPath) {
    folderNames[overlayPath] = "overlay_folder"
  })

  return folderNames
}
