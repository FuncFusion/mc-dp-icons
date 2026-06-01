import * as vscode from "vscode"
import { isMinecraftWorkspace } from "../dynamicIcons/workspace"

const DISMISSED_KEY = "mc-dp-icons.compactFoldersPromptDismissed"

export async function showCompactFoldersPrompt(context: vscode.ExtensionContext) {
  if (context.globalState.get<boolean>(DISMISSED_KEY)) {
    return
  }

  const isMinecraft = await isMinecraftWorkspace()
  if (!isMinecraft) {
    return
  }

  const explorerConfig = vscode.workspace.getConfiguration("explorer")
  if (!explorerConfig.get<boolean>("compactFolders")) {
    return
  }

  const GLOBAL = "Disable globally"
  const WORKSPACE = "Disable in workspace"
  const NEVER = "Don't show again"

  vscode.window.showErrorMessage(
    "Get the best experience by disabling 'Compact Folders'. Disable setting?",
    { modal: false },
    GLOBAL,
    WORKSPACE,
    NEVER
  ).then(function(selection) {
    if (selection === GLOBAL) {
      explorerConfig.update("compactFolders", false, vscode.ConfigurationTarget.Global)
    } else if (selection === WORKSPACE) {
        explorerConfig.update("compactFolders", false, vscode.ConfigurationTarget.Workspace)
    } else if (selection === NEVER) {
      context.globalState.update(DISMISSED_KEY, true)
    }
  })
}
