// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as LocalIcons from './local_icons';
import * as DynamicIcons from './dynamic_icons';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Extension "mc-dp-icons" is now active!');

  // Register the event listeners
  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(()=>{DynamicIcons.update(); LocalIcons.checkPackMcmeta();}),
    vscode.workspace.onDidRenameFiles(()=>{DynamicIcons.update(); LocalIcons.checkPackMcmeta();}),
    vscode.workspace.onDidDeleteFiles(()=>{DynamicIcons.update(); LocalIcons.checkPackMcmeta();}),
    vscode.workspace.onDidCreateFiles(()=>{DynamicIcons.update(); LocalIcons.checkPackMcmeta();}),
    vscode.workspace.onDidChangeTextDocument(DynamicIcons.update)
  );
  
  // Get the default icon theme on configuration change
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(LocalIcons.getDefaltIconTheme)
  );
  // Get default Icon theme on startup
  LocalIcons.getDefaltIconTheme();
  
  // Check for pack.mcmeta on startup
  LocalIcons.checkPackMcmeta();

  // Change load and tick mcfunction icons
  DynamicIcons.update();

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('mc-dp-icons.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		LocalIcons.checkPackMcmeta();
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