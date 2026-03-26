import * as vscode from "vscode";
import * as DynamicIcons from "./dynamic_icons/main";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  const UPDATE_INTERVAL = 50;
  let updateTimer: NodeJS.Timeout | undefined

  const runUpdates = () => {
    if (updateTimer) {
      clearTimeout(updateTimer)
    }

    updateTimer = setTimeout(() => {
      DynamicIcons.update()
      console.log("mc-dp-icons: Updating Dynamic icons")
      updateTimer = undefined
    }, UPDATE_INTERVAL)
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

  DynamicIcons.update();

  const DpIconsOpenSettings = vscode.commands.registerCommand(
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
