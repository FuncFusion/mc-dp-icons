import * as vscode from "vscode"
import { changeGlobalConfig, changeWorkspaceConfig, getConfig } from "../configuration/configManager"

export function warnAboutTooManyFiles() {
  if (getConfig("tooManyFilesWarningDismissed")) {
    return
  }

  const warningMessage = "Too many files in subsubfolders (Over 10000). Subfolder icons feature might not work properly. Would you like to disable this feature?"

  vscode.window
    .showWarningMessage(
      warningMessage,
      { modal: false },
      "Disable Globally",
      "Disable in This Workspace",
      "Don't show again"
    )
    .then(function(selection) {
      if (selection === "Disable Globally") {
        changeGlobalConfig("mc-dp-icons.subfolderIcons", false)
      } else if (selection === "Disable in This Workspace") {
        changeWorkspaceConfig("mc-dp-icons.subfolderIcons", false)
      } else if (selection === "Don't show again") {
        changeWorkspaceConfig("mc-dp-icons.tooManyFilesWarningDismissed", true)
      }
    })
}
