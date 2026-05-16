import * as vscode from "vscode"

export const openSettings = {
  id: "mc-dp-icons.DpIconsOpenSettings",
  handler: () =>
    vscode.commands.executeCommand("workbench.action.openSettings", "@ext:superant.mc-dp-icons"),
}
