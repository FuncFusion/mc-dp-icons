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

  const NEVER = "Never show again"
  const APPLY = "Apply"

  vscode.window.showInformationMessage(
    "[Datapack Icons] For the best experience, disable compact folders.",
    { modal: true },
    APPLY,
    NEVER
  ).then(function(selection) {
    if (selection === APPLY) {
      explorerConfig.update("compactFolders", false, vscode.ConfigurationTarget.Global)
    }
    if (selection === NEVER) {
      context.globalState.update(DISMISSED_KEY, true)
    }
  })
}
