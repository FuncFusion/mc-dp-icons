import * as vscode from "vscode"
import { Utils } from "vscode-uri"
import { getConfig } from "../configuration/configManager"
import { baseTheme, subfolderIconMap } from "../data/baseTheme"
import { ThemeBuilder } from "../theme/themeBuilder"
import {
  buildCollectOptionsFromVscodeConfig,
  collectWorkspaceContributions,
  createVscodeFsPort,
} from "../themeScan"
import { workspaceDetection } from "./workspace"
import { logger } from "../common/logger"
import { warnAboutTooManyFiles } from "./utils"

export type { ThemeContributions } from "../themeScan"

export let extensionUri: vscode.Uri

export function setExtensionUri(uri: vscode.Uri) {
  extensionUri = uri
}

export async function update() {
  logger.debug("Starting theme update")

  await workspaceDetection()

  const activePath = Utils.joinPath(extensionUri, "icon_theme", "active.json").fsPath

  const builder = new ThemeBuilder(baseTheme)

  const fs = createVscodeFsPort()
  if (fs.roots.length > 0) {
    const contributions = await collectWorkspaceContributions(
      buildCollectOptionsFromVscodeConfig(fs, subfolderIconMap, {
        onSubfolderFileCount: (count) => {
          if (count >= 2000) {
            warnAboutTooManyFiles()
          }
        },
        onLoadTickNamingConflict: () => {
          vscode.window.showWarningMessage(
            "Naming Conflict: Tick and Load functions must be unique"
          )
        },
      })
    )

    builder.addFileNames(contributions.fileNames)
    if (contributions.folderNames) {
      builder.addFolders(contributions.folderNames)
    }
  }

  const confHideFolderArrows = getConfig("hideFolderArrows")
  if (confHideFolderArrows) {
    builder.setHidesExplorerArrows(true)
  }

  await builder.write(activePath)
  logger.debug("Theme written to", activePath)
}
