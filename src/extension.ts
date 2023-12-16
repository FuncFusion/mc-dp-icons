// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { workspace } from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import util from 'util';
import { spec } from 'node:test/reporters';
import { endianness } from 'os';

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
		checkPackMcmeta();
		vscode.window.showInformationMessage('Hello World from Datapack Icons!');
	});

  
  let specificIconChange = vscode.commands.registerCommand('mc-dp-icons.specificIconChange', () => {
		specificIconChangeTest();
		vscode.window.showInformationMessage('Change load.mcfunction icons');
	});
	let specificIconChange2 = vscode.commands.registerCommand('mc-dp-icons.specificIconChange2', () => {
		specificIconChangeTest2();
		vscode.window.showInformationMessage('Change tick.mcfunction icons');
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(specificIconChange);
	context.subscriptions.push(specificIconChange2);
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

async function specificIconChangeTest() {
  const enableLoadTickChange = workspace.getConfiguration().get<boolean>('mc-dp-icons.enableLoadTickAutoChange');
  if (enableLoadTickChange) {
  // Get the absolute path to mc-dp-icon-theme.json
  const themePath = path.join(__dirname, '..', 'fileicons', 'mc-dp-icon-theme.json');
  console.log(themePath);
  let load_function_names = await findReferenceLoad();
  // Parse content of mc-dp-icon-theme.json
  const themeContent = fs.readFileSync(themePath, 'utf8');
  const themeObject = JSON.parse(themeContent);
  // Modify themcfunction icon from cb_chain to misc
  load_function_names.forEach((function_name:string) => {
      themeObject.fileNames[function_name] = "mcf_load";
  console.log('changed ' + function_name);
  });
  // themeObject.fileNames.mcf.iconPath = './imgs/cb_chain.svg';
  // Convert the JavaScript object back into a JSON string and write it back into file 
  const updatedThemeContent = JSON.stringify(themeObject, null, 2);
  fs.writeFileSync(themePath, updatedThemeContent, 'utf8');
  }
}

async function specificIconChangeTest2() {
  const enableLoadTickChange = workspace.getConfiguration().get<boolean>('mc-dp-icons.enableLoadTickAutoChange');
  if (enableLoadTickChange) {
    // Get the absolute path to mc-dp-icon-theme.json
    const themePath = path.join(__dirname, '..', 'fileicons', 'mc-dp-icon-theme.json');
    console.log(themePath);
    let tick_function_names = await findReferenceTick();
    // Parse content of mc-dp-icon-theme.json
    const themeContent = fs.readFileSync(themePath, 'utf8');
    const themeObject = JSON.parse(themeContent);
    // Modify themcfunction icon from cb_chain to misc
    tick_function_names.forEach((function_name:string) => {
        themeObject.fileNames[function_name] = "mcf_tick";
		console.log('changed ' + function_name);
    });
    // themeObject.fileNames.mcf.iconPath = './imgs/cb_chain.svg';
    // Convert the JavaScript object back into a JSON string and write it back into file 
    const updatedThemeContent = JSON.stringify(themeObject, null, 2);
    fs.writeFileSync(themePath, updatedThemeContent, 'utf8');
  }
}

// Convert fs.readFile and fs.writeFile into Promise version to use with async/await
const readFile = util.promisify(fs.readFile);

function removeFirstPart(input: string): string {return input.split(':')[1]; }

async function processFile(file: vscode.Uri) {
	const tickJsonPath = file.fsPath;
    try {
		const data = await readFile(tickJsonPath, 'utf8');
        const tickJson = JSON.parse(data);
		
        if (tickJson.values && tickJson.values.length > 0) {
			let values = tickJson.values;
			values = values.map(removeFirstPart);
			values = values.map((value: string) => value += ".mcfunction");
			console.log("values array: " + values);
			return values;
        } else {
			console.log('No values found');
            return [];
        }
    } catch (err) {
		console.error(`Failed to read file: ${err}`);
        return [];
    }
}

async function findReferenceTick() {
	const files = await vscode.workspace.findFiles('**/tick.json', '**/node_modules/**');
    if (files.length > 0) {
		for (const file of files) {
			let values = await processFile(file);
			console.log("values array: " + values);
            return values;
        }
    } else {
		console.log('tick.json not found');
    }
}

async function findReferenceLoad() {
	const files = await vscode.workspace.findFiles('**/load.json', '**/node_modules/**');
    if (files.length > 0) {
		for (const file of files) {
			let values = await processFile(file);
			console.log("values array: " + values);
            return values;
        }
    } else {
		console.log('load.json not found');
    }
}

// This method is called when your extension is deactivated
export function deactivate() {}