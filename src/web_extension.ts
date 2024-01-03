import * as vscode from 'vscode';
import * as ThemeChange from './theme_change';

export function activate(context: vscode.ExtensionContext) {
	// console.log('Extension "mc-dp-icons" is now active!');

	// Register the event listeners
	context.subscriptions.push(
		vscode.workspace.onDidChangeWorkspaceFolders(()=>{ThemeChange.checkPackMcmeta();}),
		vscode.workspace.onDidRenameFiles(()=>{ThemeChange.checkPackMcmeta();}),
		vscode.workspace.onDidDeleteFiles(()=>{ThemeChange.checkPackMcmeta();}),
		vscode.workspace.onDidCreateFiles(()=>{ThemeChange.checkPackMcmeta();}),
		vscode.workspace.onDidChangeConfiguration(()=>{ThemeChange.getDefaultIconTheme();})
	);

	// Calling these functions on startup
	ThemeChange.getDefaultIconTheme();
	ThemeChange.checkPackMcmeta();
	
	let DpIconsOpenSettings = vscode.commands.registerCommand('mc-dp-icons.DpIconsOpenSettings', () => {
		vscode.commands.executeCommand('workbench.action.openSettings', '@ext:superant.mc-dp-icons');
	});

	context.subscriptions.push(DpIconsOpenSettings);
}
