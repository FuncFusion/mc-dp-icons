import * as vscode from "vscode"
import { openSettings } from "./openSettings"
import { commands as iconCommands } from "./setIcon"

const commandList = [openSettings, ...iconCommands]

export function registerAll(context: vscode.ExtensionContext) {
  for (const command of commandList) {
    context.subscriptions.push(
      vscode.commands.registerCommand(command.id, command.handler)
    )
  }
}
