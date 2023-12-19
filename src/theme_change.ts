import * as vscode from 'vscode';
import { workspace } from 'vscode';

let defaultIconTheme: string | undefined;

export function getDefaultIconTheme() {
		// Get the theme user set in the settings of the extension
		let confDefaultIconTheme = workspace.getConfiguration().get<string>('mc-dp-icons.setDefaultIconTheme');
		// If it's blank, then get current icon theme the user uses
		if (confDefaultIconTheme === "") {
			let gettingDefaultIconTheme = vscode.workspace.getConfiguration('workbench').get<string>('iconTheme');
			// If the theme the user uses is mc-dp-icons, then set the defaultIconTheme to the one set in the settings of the extension
			if (gettingDefaultIconTheme !== "mc-dp-icons") {
				defaultIconTheme = gettingDefaultIconTheme;
			}
		} else {
			defaultIconTheme = confDefaultIconTheme;
		}
	}

export function checkPackMcmeta() {
		// Get the configuration if the user wants to check for pack.mcmeta
		const enableCheck = workspace.getConfiguration().get<boolean>('mc-dp-icons.enablePackMcmetaCheck');
		// If the configuration is true, then start finding pack.mcmeta in the workspace
		if (enableCheck) {
		// Fund pack.mcmeta in the workspace, excluding node_modules folder
		vscode.workspace
			.findFiles('**/pack.mcmeta', '**/node_modules/**')
			.then((files) => {
				if (files.length > 0) {
					//If there is pack.mcmeta, then set the icon theme to the Datapack Icons theme
					vscode.workspace.getConfiguration('workbench')
						.update('iconTheme', 'mc-dp-icons', vscode.ConfigurationTarget.Workspace);
				} else {
					// If there is no pack.mcmeta, set the icon theme to the default one
					if (defaultIconTheme) {
						vscode.workspace.getConfiguration('workbench')
							.update('iconTheme', defaultIconTheme, vscode.ConfigurationTarget.Workspace);
					}
				}
			});
		}
	}
	
	