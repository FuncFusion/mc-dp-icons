import * as vscode from "vscode";
import * as ThemeChange from "./theme_change";
import * as DynamicIcons from "./dynamic_icons/main";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {

  let updateTimer: NodeJS.Timeout | undefined

  const runUpdates = () => {
    if (updateTimer) {
      clearTimeout(updateTimer)
    }

    updateTimer = setTimeout(() => {
      DynamicIcons.update()
      ThemeChange.checkPackMcmeta()
      console.log("mc-dp-icons: Updating Dynamic icons")
      updateTimer = undefined
    }, 50)
  }

  const handleFileChange = (fileName: string) => {
    const validFile = (fileName === "pack.mcmeta" || fileName.endsWith(".json")) && fileName !== "settings.json";

    if (validFile) {
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
