import * as vscode from "vscode"
import { changeGlobalConfig, changeWorkspaceConfig } from "../configuration/configManager"

export function warnAboutTooManyFiles() {
  const warningMessage = "Too many files in subsubfolders (Over 10000). Subfolder icons feature might not work properly. Would you like to disable this feature?"

  vscode.window
    .showWarningMessage(
      warningMessage,
      { modal: true },
      "Disable Globally",
      "Disable in This Workspace",
    )
    .then(function(selection) {
      if (selection === "Disable Globally") {
        changeGlobalConfig("mc-dp-icons.subfolderIcons", false)
      } else if (selection === "Disable in This Workspace") {
        changeWorkspaceConfig("mc-dp-icons.subfolderIcons", false)
      }
    })
}
