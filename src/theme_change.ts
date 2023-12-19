import * as vscode from 'vscode';
import { workspace } from 'vscode';

let defaultIconTheme: string | undefined;

export function getDefaultIconTheme() {
	let confDefaultIconTheme = workspace.getConfiguration().get<string>('mc-dp-icons.setDefaultIconTheme');
	if (confDefaultIconTheme === "") {
		let currentIconTheme = vscode.workspace.getConfiguration('workbench').get<string>('iconTheme');
		
		if (currentIconTheme !== "mc-dp-icons") {
			defaultIconTheme = currentIconTheme;
		}
	} else {
		defaultIconTheme = confDefaultIconTheme;
	}
}

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
			} else {
				if (defaultIconTheme) {
					vscode.workspace.getConfiguration('workbench')
						.update('iconTheme', defaultIconTheme, vscode.ConfigurationTarget.Workspace);
				}
			}
		});
	}
}
	
	