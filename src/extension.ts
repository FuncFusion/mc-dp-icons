// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { workspace } from 'vscode';

let defaultIconTheme: string | undefined;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Extension "mc-dp-icons" is now active!');
  // Register the event listeners
  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(checkPackMcmeta),
    vscode.workspace.onDidRenameFiles(checkPackMcmeta),
    vscode.workspace.onDidDeleteFiles(checkPackMcmeta),
    vscode.workspace.onDidCreateFiles(checkPackMcmeta)
  );
  // Get the default icon theme
  defaultIconTheme = vscode.workspace.getConfiguration('workbench').get<string>('iconTheme');
  console.log(defaultIconTheme);

  // Check for pack.mcmeta on startup
  checkPackMcmeta();

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('mc-dp-icons.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Datapack Icons!');
	});

	context.subscriptions.push(disposable);
}

function checkPackMcmeta() {
	const enableCheck = workspace.getConfiguration().get<boolean>('mc-dp-icons.enablePackMcmetaCheck');
	if (enableCheck) {

  // Find the pack.mcmeta file in the workspace
  vscode.workspace
    .findFiles('**/pack.mcmeta', '**/node_modules/**')
    .then((files) => {
      if (files.length > 0) {
        console.log('pack.mcmeta is found');
        // Set the icon theme to the Datapack Icons theme
        vscode.workspace
       	.getConfiguration('workbench')
        .update('iconTheme', 'mc-dp-icons', vscode.ConfigurationTarget.Workspace);
    } else {
        	console.log('pack.mcmeta is not found');
        	// Reset the icon theme to the default one
        	if (defaultIconTheme) {
          	vscode.workspace
            	.getConfiguration('workbench')
            	.update('iconTheme', defaultIconTheme, vscode.ConfigurationTarget.Workspace);
				console.log('changing to default, which is ' + defaultIconTheme);
				console.log('now its ' + vscode.workspace.getConfiguration('workbench').get<string>('iconTheme'));
        	}
      	}
    	});
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
