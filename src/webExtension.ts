import * as vscode from 'vscode';
import { workspaceDetection } from './dynamic_icons/main';

export function activate(context: vscode.ExtensionContext) {
  
  const runWorkspaceDetection = () => {
    workspaceDetection();
  };

  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      runWorkspaceDetection();
    }),
    vscode.workspace.onDidRenameFiles(() => {
      runWorkspaceDetection();
    }),
    vscode.workspace.onDidDeleteFiles(() => {
      runWorkspaceDetection();
    }),
    vscode.workspace.onDidCreateFiles(() => {
      runWorkspaceDetection();
    }),
    vscode.workspace.onDidSaveTextDocument(() => {
      runWorkspaceDetection();
    }),
    vscode.workspace.onDidChangeConfiguration(() => {
      runWorkspaceDetection();
    }),
  );

  workspaceDetection();

  const DpIconsOpenSettings = vscode.commands.registerCommand(
    'mc-dp-icons.DpIconsOpenSettings',
    () => {
      vscode.commands.executeCommand(
        'workbench.action.openSettings',
        '@ext:superant.mc-dp-icons',
      );
    },
  );

  context.subscriptions.push(DpIconsOpenSettings);
}
