import * as vscode from "vscode"
import { changeGlobalConfig, changeWorkspaceConfig, getConfig } from "../configuration/configManager"
import { logger } from "../common/logger"

export function warnAboutTooManyFiles() {
  logger.debug("warnAboutTooManyFiles: called")
  const dismissed = getConfig("tooManyFilesWarningDismissed")
  logger.debug("warnAboutTooManyFiles: tooManyFilesWarningDismissed =", dismissed)
  if (dismissed) {
    logger.debug("warnAboutTooManyFiles: warning dismissed, skipping")
    return
  }

  const warningMessage = "Too many files in subsubfolders (Over 10000). Subfolder icons feature might not work properly. Would you like to disable this feature?"

  logger.debug("warnAboutTooManyFiles: showing warning")
  vscode.window
    .showWarningMessage(
      warningMessage,
      { modal: false },
      "Disable Globally",
      "Disable in This Workspace",
      "Don't show again"
    )
    .then(function(selection) {
      logger.debug("warnAboutTooManyFiles: selection =", selection)
      if (selection === "Disable Globally") {
        changeGlobalConfig("mc-dp-icons.subfolderIcons", false)
      } else if (selection === "Disable in This Workspace") {
        changeWorkspaceConfig("mc-dp-icons.subfolderIcons", false)
      } else if (selection === "Don't show again") {
        changeWorkspaceConfig("mc-dp-icons.tooManyFilesWarningDismissed", true)
      }
    })
}
