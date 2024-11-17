import * as vscode from "vscode";
import * as ThemeChange from "./theme_change";
import * as DynamicIcons from "./dynamic_icons/main";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  // Register listeners
  const handleFileChange = (fileName: string) => {
    if (["tick.json", "load.json", "pack.mcmeta"].includes(fileName)) {
      DynamicIcons.update();
      ThemeChange.checkPackMcmeta();
    }
  };

  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      handleFileChange("");
    }),
    vscode.workspace.onDidRenameFiles((event) => {
      handleFileChange(path.basename(event.files[0].newUri.fsPath));
      handleFileChange(path.basename(event.files[0].oldUri.fsPath));
    }),
    vscode.workspace.onDidDeleteFiles((event) => {
      handleFileChange(path.basename(event.files[0].fsPath));
    }),
    vscode.workspace.onDidCreateFiles((event) => {
      handleFileChange(path.basename(event.files[0].fsPath));
    }),
    vscode.workspace.onDidSaveTextDocument((document) => {
      handleFileChange(path.basename(document.fileName));
    }),
    vscode.workspace.onDidChangeConfiguration(() => {
      DynamicIcons.update();
      ThemeChange.getDefaultIconTheme();
    }),
  );

  // Calling these functions on startup
  ThemeChange.getDefaultIconTheme();
  ThemeChange.checkPackMcmeta();
  DynamicIcons.update();

  let DpIconsOpenSettings = vscode.commands.registerCommand(
    "mc-dp-icons.DpIconsOpenSettings",
    () => {
      vscode.commands.executeCommand(
        "workbench.action.openSettings",
        "@ext:superant.mc-dp-icons",
      );
    },
  );

  context.subscriptions.push(DpIconsOpenSettings);
}
