// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as ThemeChange from './theme_change';
import * as DynamicIcons from './dynamic_icons';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Extension "mc-dp-icons" is now active!');

  // Register the event listeners
  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(()=>{DynamicIcons.update(); ThemeChange.checkPackMcmeta();}),
    vscode.workspace.onDidRenameFiles(()=>{DynamicIcons.update(); ThemeChange.checkPackMcmeta();}),
    vscode.workspace.onDidDeleteFiles(()=>{DynamicIcons.update(); ThemeChange.checkPackMcmeta();}),
    vscode.workspace.onDidCreateFiles(()=>{DynamicIcons.update(); ThemeChange.checkPackMcmeta();}),
    vscode.workspace.onDidChangeTextDocument(DynamicIcons.update),
    vscode.workspace.onDidChangeConfiguration(()=>{DynamicIcons.update(); ThemeChange.getDefaultIconTheme();})
  );
  

  // Get default Icon theme on startup
  ThemeChange.getDefaultIconTheme();
  
  // Check for pack.mcmeta on startup
  ThemeChange.checkPackMcmeta();

  // Change load and tick mcfunction icons
  DynamicIcons.update();

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('mc-dp-icons.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		ThemeChange.checkPackMcmeta();
		vscode.window.showInformationMessage('Hello World from Datapack Icons!');
	});


	// let dynamicLoadTickChangeCommand = vscode.commands.registerCommand('mc-dp-icons.dynamicLoadTickChange', () => {
	// 	dynamicLoadTickChange();
	// 	vscode.window.showInformationMessage('Change tick and load functions icons');
	// });

	context.subscriptions.push(disposable);
	// context.subscriptions.push(dynamicLoadTickChangeCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}