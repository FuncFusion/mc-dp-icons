import * as vscode from "vscode";
import * as ThemeChange from "./theme_change";
import * as DynamicIcons from "./dynamic_icons/main";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  // Register listeners
  const runUpdates = () => {
    DynamicIcons.update();
    ThemeChange.checkPackMcmeta();
    console.log("mc-dp-icons: Updating Dynamic icons");
  };
  const handleFileChange = (fileName: string) => {
    if (fileName.endsWith(".mcmeta") || fileName.endsWith(".json")) {
      runUpdates();
    }
  };

  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      runUpdates();
    }),
    vscode.workspace.onDidRenameFiles(() => {
      runUpdates();
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
      runUpdates();
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
