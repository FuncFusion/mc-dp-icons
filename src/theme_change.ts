import * as vscode from 'vscode';
import { workspace } from 'vscode';

let defaultIconTheme: string | undefined;
let currentIconTheme: string | undefined;

export function getDefaultIconTheme() {
	let configIconTheme = workspace.getConfiguration().get<string>('mc-dp-icons.setDefaultIconTheme');
	if (configIconTheme === "") {
		let currentIconTheme = vscode.workspace.getConfiguration('workbench').get<string>('iconTheme');
		if (currentIconTheme !== "mc-dp-icons") {
			defaultIconTheme = currentIconTheme;
		}
	} else {
		defaultIconTheme = configIconTheme;
	}
}

// Updates the icon theme theme based on the existence of pack.mcmeta in the workspace
export function checkPackMcmeta() {
	const enableCheck = workspace.getConfiguration().get<boolean>('mc-dp-icons.enablePackMcmetaCheck');
		if (enableCheck) {
		vscode.workspace
		.findFiles('**/pack.mcmeta', '**/node_modules/**')
		.then((files) => {
			const packMcmetaExists = files.length > 0;
			if (packMcmetaExists) {
				vscode.workspace.getConfiguration('workbench')
					.update('iconTheme', 'mc-dp-icons', vscode.ConfigurationTarget.Workspace);
			} else if (vscode.workspace.getConfiguration('workbench').get<string>('iconTheme') === "mc-dp-icons") {
				vscode.workspace.getConfiguration('workbench')
					.update('iconTheme', defaultIconTheme, vscode.ConfigurationTarget.Workspace);
			}
		});
	}
}
	
	