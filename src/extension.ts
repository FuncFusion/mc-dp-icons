import * as vscode from "vscode";
import * as DynamicIcons from "./dynamic_icons/main";

export function activate(context: vscode.ExtensionContext) {
  DynamicIcons.setExtensionUri(context.extensionUri);
  
  const UPDATE_INTERVAL = 50;
  let updateTimer: NodeJS.Timeout | undefined

  const runUpdates = () => {
    if (updateTimer) {
      clearTimeout(updateTimer)
    }

    updateTimer = setTimeout(() => {
      DynamicIcons.update()
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
      handleFileChange(event.files[0].fsPath.split('/').pop() || '');
    }),
    vscode.workspace.onDidCreateFiles((event) => {
      handleFileChange(event.files[0].fsPath.split('/').pop() || '');
    }),
    vscode.workspace.onDidSaveTextDocument((document) => {
      handleFileChange(document.fileName.split('/').pop() || '');
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
