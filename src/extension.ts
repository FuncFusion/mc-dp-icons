import * as vscode from "vscode"
import * as DynamicIcons from "./dynamicIcons"
import { createFileWatcher } from "./watcher"
import { registerAll } from "./commands"
import { showCompactFoldersPrompt } from "./prompts/compactFoldersPrompt"

export function activate(context: vscode.ExtensionContext) {
  DynamicIcons.setExtensionUri(context.extensionUri)

  const watcher = createFileWatcher(() => DynamicIcons.update())
  context.subscriptions.push(...watcher.subscriptions)

  DynamicIcons.update().catch(function(error) {
    console.error("mc-dp-icons: update failed", error)
  })
  registerAll(context)
  showCompactFoldersPrompt(context)
}
