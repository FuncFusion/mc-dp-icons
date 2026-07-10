import * as vscode from "vscode"
import { Utils } from 'vscode-uri'
import { getConfig } from "../configuration/configManager"
import { baseTheme } from "../data/baseTheme"
import { ThemeBuilder } from "../theme/themeBuilder"
import { workspaceDetection } from "./workspace"
import { logger } from "../common/logger"
import { java } from "./java"
import { bedrock } from "./bedrock"
import type { ThemeModule } from "./plugin"

const modules: ThemeModule[] = [java, bedrock]

export let extensionUri: vscode.Uri
let isUpdating = false

export function setExtensionUri(uri: vscode.Uri) {
  extensionUri = uri
}

export async function update() {
  if (isUpdating) {
    return
  }
  isUpdating = true

  try {
    logger.debug("Starting theme update")

    await workspaceDetection()

    const activePath = Utils.joinPath(extensionUri, "icon_theme", "active.json").fsPath

    const builder = new ThemeBuilder(baseTheme)

    const activeModules: ThemeModule[] = []
    for (const module of modules) {
      if (await module.guard()) {
        activeModules.push(module)
      }
    }

    const results = await Promise.all(
      activeModules.map(module => module.collect())
    )

    for (const result of results) {
      builder.addFileNames(result.fileNames)
      if (result.folderNames) {
        builder.addFolders(result.folderNames)
      }
    }

    const confHideFolderArrows = getConfig("hideFolderArrows")
    if (confHideFolderArrows) {
      builder.setHidesExplorerArrows(true)
    }

    await builder.write(activePath)
    logger.debug("Theme written to", activePath)
  } finally {
    isUpdating = false
  }
}
