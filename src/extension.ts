import * as vscode from "vscode"
import * as DynamicIcons from "./dynamicIcons"
import { createFileWatcher } from "./watcher"
import { registerAll } from "./commands"

export function activate(context: vscode.ExtensionContext) {
  DynamicIcons.setExtensionUri(context.extensionUri)

  const watcher = createFileWatcher(() => DynamicIcons.update())
  context.subscriptions.push(...watcher.subscriptions)

  DynamicIcons.update()
  registerAll(context)
}
