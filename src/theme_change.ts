import vscode, { workspace } from 'vscode';

export function getDefaultIconTheme() {
	return workspace.getConfiguration().get<string>('mc-dp-icons.setDefaultIconTheme')
		|| workspace.getConfiguration('workbench').get<string>('iconTheme');
}

// resolution order provided by vscode/index.d.ts
// * 1. `defaultValue` (if defined in `package.json` otherwise derived from the value's type)
// * 1. `globalValue` (if defined)
// * 1. `workspaceValue` (if defined)
// * 1. `workspaceFolderValue` (if defined)
// * 1. `defaultLanguageValue` (if defined)
// * 1. `globalLanguageValue` (if defined)
// * 1. `workspaceLanguageValue` (if defined)
// * 1. `workspaceFolderLanguageValue` (if defined)

// Updates the icon theme theme based on the existence of pack.mcmeta in the workspace
export async function checkPackMcmeta() {
	if (!workspace.getConfiguration().get<boolean>('mc-dp-icons.enablePackMcmetaCheck')) {return;}

	const files = await workspace.findFiles('**/pack.mcmeta', '**/node_modules/**', 1);

	const packMcmetaExists = files.length > 0;

	// Get the workspace folder of the pack.mcmeta file
	const workspaceFolder = workspace.getWorkspaceFolder(files[0]);

	if (!workspaceFolder) {return;}

	const workspaceConfig = workspace.getConfiguration('workbench', workspaceFolder).inspect<string>('iconTheme');

	// should not happen, since iconTheme is always provided by vscode
	if (!workspaceConfig) {return;}

	const workspaceIconTheme = workspaceConfig.workspaceFolderValue || workspaceConfig.workspaceValue;

	if (packMcmetaExists && !workspaceIconTheme) {
		workspace.getConfiguration('workbench')
			.update('iconTheme', 'mc-dp-icons', vscode.ConfigurationTarget.Workspace);
	}
}
