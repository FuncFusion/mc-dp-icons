import * as vscode from "vscode"
import { workspace } from "vscode"
import { config } from "../configuration/configManager"
import { logger } from "../common/logger"

export async function workspaceDetection() {
  const isDetectionEnabled = config.get("workspaceDetection")
  if (!isDetectionEnabled) {
    logger.debug("Workspace detection disabled, skipping")
    return
  }

  const isMinecraft = await isMinecraftWorkspace()

  if (isMinecraft) {
    logger.debug("Detected Minecraft workspace, activating theme")
    config.changeWorkspace("workbench.iconTheme", "mc-dp-icons")
    return
  }

  const fallbackIconTheme = config.get("fallbackIconTheme")
  if (fallbackIconTheme) {
    logger.debug("Falling back to configured theme:", fallbackIconTheme)
    config.changeWorkspace("workbench.iconTheme", fallbackIconTheme)
    return
  }

  const workbenchConfig = vscode.workspace.getConfiguration("workbench")
  const iconThemeInspection = workbenchConfig.inspect<string>("iconTheme")
  const userDefaultTheme = iconThemeInspection?.globalValue

  logger.debug("No Minecraft workspace detected, falling back to user default:", userDefaultTheme)
  config.changeWorkspace("workbench.iconTheme", userDefaultTheme)
}

async function isMinecraftWorkspace(): Promise<boolean> {
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
