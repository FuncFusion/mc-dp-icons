import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import util from 'util';
import { workspace } from 'vscode';

// This function is called in extension.ts
export function update() {
	deleteTempIconDefinitions();
	loadTickChange();
	namespaceIcon();
	hideFolderArrows();
}

async function hideFolderArrows() {
	const confHideFolderArrows = workspace.getConfiguration().get<boolean>('mc-dp-icons.hideFolderArrows');
	if (confHideFolderArrows) {
		modifyTheme('hidesExplorerArrows', true);
	} else {
		modifyTheme('hidesExplorerArrows', false);
	}
}

// Give namespaces an enderchest icon.
async function namespaceIcon() {
	const enableNamespaceIcons = workspace.getConfiguration().get<boolean>('mc-dp-icons.enableNamespaceIcons');
	if (enableNamespaceIcons) {
		let namespaceNames: string[] = getNamespaceNames() || [];
		namespaceNames.forEach((namespace: string) => {
			modifyTheme(['folderNames', namespace], 'namespace');
			modifyTheme(['folderNamesExpanded', namespace], 'namespace_open');
		});
	} 
}

// Give icons to functions referenced in tick.json | load.json accordingly
async function loadTickChange() {
	const enableDynamicLoadTickChange = workspace.getConfiguration().get<boolean>('mc-dp-icons.enableLoadTickAutoChange');
	if (enableDynamicLoadTickChange) {
		const [loadNames, tickNames] = await findReference() || [];
		loadNames?.forEach((loadName: string) => {
			modifyTheme(['fileNames', loadName], "mcf_load");
		});
		tickNames?.forEach((tickName: string) => {
			modifyTheme(['fileNames', tickName], "mcf_tick");
		});
	} else {
		const customLoadNames = workspace.getConfiguration().get<Array<string>>('mc-dp-icons.functionNamesForLoad');
		const customTickNames = workspace.getConfiguration().get<Array<string>>('mc-dp-icons.functionNamesForTick');

		const hasCommonName = customLoadNames?.some(item => customTickNames?.includes(item));
		if (hasCommonName) {
			vscode.window.showWarningMessage('You have same names in custom tick / load icons configuration');
		}
		customLoadNames?.forEach((loadName: string) => {
			modifyTheme(['fileNames', loadName + ".mcfunction"], "mcf_load");
		});
		customTickNames?.forEach((tickName: string) => {
			modifyTheme(['fileNames', tickName + ".mcfunction"], "mcf_tick");
		});
	}
}

/* 
:arg keyName: Name of file / folder you intend to modify the icon of
:arg value: Value assigned to keyName
*/
async function modifyTheme(keyName: string | string[], value: any) {
	const themePath = path.join(__dirname, '..', 'fileicons', 'mc-dp-icon-theme.json');
	let themeContent = fs.readFileSync(themePath, 'utf8');
	let themeObject = JSON.parse(themeContent), current = themeObject;

	if (Array.isArray(keyName)) {
		for (let i = 0; i < keyName.length; i++) {
			current[keyName[i]] = i === keyName.length - 1 ? value : current[keyName[i]] || {};
			if (i !== keyName.length - 1) { current = current[keyName[i]]; }
		}
	} else { current[keyName] = value; }

	fs.writeFileSync(themePath, JSON.stringify(themeObject, null, 2), 'utf8');
}

const readFile = util.promisify(fs.readFile);

// Returns two arrays with mcfunction names of load and tick functions
async function findReference() {
	const tickReference = await vscode.workspace.findFiles('**/tick.json', '**/node_modules/**');
	const loadReference = await vscode.workspace.findFiles('**/load.json', '**/node_modules/**');
	if (tickReference?.length > 0 || loadReference?.length > 0) {
		let loadNames: string[] = [];
		let tickNames: string[] = [];
		for (let i = 0; i < loadReference.length; i++) {
			let loadValue = await convertMcfunctionIdToFilename(loadReference[i]);
			loadNames = [...loadNames, ...loadValue];
		}
		for (let i = 0; i < tickReference.length; i++) {
			let tickValue = await convertMcfunctionIdToFilename(tickReference[i]);
			tickNames = [...tickNames, ...tickValue];
		}
		return [loadNames, tickNames];
	} else {
		console.log('tick.json or load.json not found');
	}
}

async function deleteTempIconDefinitions() {
	const themePath = path.join(__dirname, '..', 'fileicons', 'mc-dp-icon-theme.json');
	const themeContent = fs.readFileSync(themePath, 'utf8');
	const themeObject = JSON.parse(themeContent);

	for (let key in themeObject.fileNames) {
		if (themeObject.fileNames[key] === "mcf_tick" || themeObject.fileNames[key] === "mcf_load") {delete themeObject.fileNames[key];}
	}
	for (let key in themeObject.folderNames) {
		if (themeObject.folderNames[key] === "namespace") {
			delete themeObject.folderNames[key];
			delete themeObject.folderNamesExpanded[key];
		}
	}

	const updatedThemeContent = JSON.stringify(themeObject, null, 2);
	fs.writeFileSync(themePath, updatedThemeContent, 'utf8');
}

/*
:arg file: tick.json | load.json file path
:return: An array of tick & load MCfunctions file names
*/
async function convertMcfunctionIdToFilename(file: vscode.Uri): Promise<string[]> {
	const tickJsonPath = file.fsPath;
	const removeNamespaceFromMCfunctionID = (input: string) => { return input.split(':')[1]; };

	try {
		const data = await readFile(tickJsonPath, 'utf8');
		const tickJson = JSON.parse(data);
		const isFunctionReferenced = tickJson.values?.length > 0;

		if (isFunctionReferenced) {
			return tickJson.values.map((value: string) => `${removeNamespaceFromMCfunctionID(value)}.mcfunction`);
		} else {
			console.log('No values found');
			return [];
		}
	} catch (err) {
		console.error(`Failed to read file: ${err}`);
		return [];
	}
}
	
// :return: An array of namespace names in a pack
function getNamespaceNames(): string[] {
	let mcmetaPaths = findMcmetaInWorkspace().map((packPath) => packPath.replace("pack.mcmeta", ""));
	const folderNames: string[] = [];

	// :return: array of names of every folder inside given directory
	const getDirectories = (path: string) => {
		if (!fs.existsSync(path)) { return []; }
		fs.readdirSync(path)
			.filter((file) => fs.statSync(`${path}/${file}`).isDirectory())
			.forEach((file) => folderNames.push(file));
	};

	if (!mcmetaPaths) { return []; };

	mcmetaPaths.forEach((packPath) => {
		try {
			getDirectories(packPath + "data");
			getDirectories(packPath + "assets");
		} catch (error) {
			console.error(`Error reading folder: ${packPath}data`, error);
		}
	});

	return folderNames;
}
// :return: An array of paths leading to pack.mcmeta
function findMcmetaInWorkspace(): string[] {
	let mcmetaPaths: string[] = [];
	const directories = vscode.workspace.workspaceFolders?.map(folder => folder.uri.fsPath) || [];

	directories.forEach(directory => {
		mcmetaPaths = mcmetaPaths.concat(findMcmetaInDirectory(directory));
	});

	return mcmetaPaths;
}

// :arg directory: Directory that will be searched for pack.mcmeta files
function findMcmetaInDirectory(directory: string): string[] {
	const files = fs.readdirSync(directory);
	let mcmetaPaths: string[] = [];

	files.forEach(fileName => {
		const filePath = `${directory}/${fileName}`;

		if (fs.statSync(filePath).isDirectory()) {
			mcmetaPaths = mcmetaPaths.concat(findMcmetaInDirectory(filePath));
		} else if (fileName === 'pack.mcmeta') {
			mcmetaPaths.push(filePath);
		}
	});

	return mcmetaPaths;
}
