import * as vscode from 'vscode';
import { workspaceDetection } from './dynamicIcons/workspace';
import { createFileWatcher } from './watcher';
import { registerAll } from './commands';

export function activate(context: vscode.ExtensionContext) {
  const watcher = createFileWatcher(() => workspaceDetection());
  context.subscriptions.push(...watcher.subscriptions);

  workspaceDetection();
  registerAll(context);
}
