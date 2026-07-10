import * as vscode from "vscode"
import { getConfig } from "../configuration/configManager"

const channel = vscode.window.createOutputChannel("Datapack Icons")

export const logger = {
  debug(...args: unknown[]) {
    if (!getConfig("debug")) {
      return
    }
    channel.appendLine("[debug] " + args.map(String).join(" "))
  },
  error(error: unknown, context?: string) {
    const msg = context ? `[error] ${context}:` : "[error]"
    channel.appendLine(msg + " " + String(error))
  },
}
