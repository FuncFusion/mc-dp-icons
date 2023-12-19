import * as vscode from 'vscode';
import * as ThemeChange from './theme_change';
import * as DynamicIcons from './dynamic_icons';

// This function is called when the extension is activated
export function activate(context: vscode.ExtensionContext) {
	// console.log('Extension "mc-dp-icons" is now active!');

	// Register the event listeners
	context.subscriptions.push(
		vscode.workspace.onDidChangeWorkspaceFolders(()=>{DynamicIcons.update(); ThemeChange.checkPackMcmeta();}),
		vscode.workspace.onDidRenameFiles(()=>{DynamicIcons.update(); ThemeChange.checkPackMcmeta();}),
		vscode.workspace.onDidDeleteFiles(()=>{DynamicIcons.update(); ThemeChange.checkPackMcmeta();}),
		vscode.workspace.onDidCreateFiles(()=>{DynamicIcons.update(); ThemeChange.checkPackMcmeta();}),
		vscode.workspace.onDidSaveTextDocument(DynamicIcons.update),
		vscode.workspace.onDidChangeConfiguration(()=>{DynamicIcons.update(); ThemeChange.getDefaultIconTheme();})
	);

	// Calling these functions on startup
	ThemeChange.getDefaultIconTheme();
	ThemeChange.checkPackMcmeta();
	DynamicIcons.update();
	}
