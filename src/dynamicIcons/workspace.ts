import * as vscode from "vscode"
import { workspace } from "vscode"
import { getConfig, changeWorkspaceConfig } from "../configuration/configManager"
import { logger } from "../common/logger"

export async function workspaceDetection() {
  const isDetectionEnabled = getConfig("workspaceDetection")
  if (!isDetectionEnabled) {
    logger.debug("Workspace detection disabled, skipping")
    return
  }

  const isMinecraft = await isMinecraftWorkspace()

  if (isMinecraft) {
    logger.debug("Detected Minecraft workspace, activating theme")
    changeWorkspaceConfig("workbench.iconTheme", "mc-dp-icons")
    return
  }

  const fallbackIconTheme = getConfig("fallbackIconTheme")
  if (fallbackIconTheme) {
    logger.debug("Falling back to configured theme:", fallbackIconTheme)
    changeWorkspaceConfig("workbench.iconTheme", fallbackIconTheme)
    return
  }

  const workbenchConfig = vscode.workspace.getConfiguration("workbench")
  const iconThemeInspection = workbenchConfig.inspect<string>("iconTheme")
  const userDefaultTheme = iconThemeInspection?.globalValue

  logger.debug("No Minecraft workspace detected, falling back to user default:", userDefaultTheme)
  changeWorkspaceConfig("workbench.iconTheme", userDefaultTheme)
}

export async function isMinecraftWorkspace(): Promise<boolean> {
  const easyPatterns = [
    "**/pack.mcmeta",
    "**/jmc_config.json",
    "**/{beet.json,beet.yaml,beet.yml}",
  ]

  for (const pattern of easyPatterns) {
    const files = await workspace.findFiles(pattern, "**/node_modules/**")
    if (files.length > 0) {
      return true
    }
  }

  const manifestFiles = await workspace.findFiles('**/manifest.json', '**/node_modules/**')

  for (const manifestFile of manifestFiles) {
    try {
      const manifestContent = await workspace.fs.readFile(manifestFile)
      const manifestJson = JSON.parse(manifestContent.toString())

      if ("format_version" in manifestJson) {
        return true
      }
    } catch (error) {
      continue
    }
  }

  return false
}
