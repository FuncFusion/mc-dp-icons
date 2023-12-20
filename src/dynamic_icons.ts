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
}

// Give namespaces an enderchest icon.
async function namespaceIcon() {
	const enableNamespaceIcons = workspace.getConfiguration().get<boolean>('mc-dp-icons.enableNamespaceIcons');
	if (enableNamespaceIcons) {
		const themePath = path.join(__dirname, '..', 'fileicons', 'mc-dp-icon-theme.json');
		let namespaceNames: string[] = getNamespaceNames() || [];
		const themeContent = fs.readFileSync(themePath, "utf-8");
		const themeObject = JSON.parse(themeContent);
		namespaceNames.forEach((namespace: string) => {
			themeObject.folderNames[namespace] = "namespace";
			themeObject.folderNamesExpanded[namespace] = "namespace_open";
		});
		const updatedThemeContent = JSON.stringify(themeObject, null, 2);
		fs.writeFileSync(themePath, updatedThemeContent, 'utf-8');
	} 
}

// Give icons to functions referenced in tick.json | load.json accordingly
async function loadTickChange() {
	const enableDynamicLoadTickChange = workspace.getConfiguration().get<boolean>('mc-dp-icons.enableLoadTickAutoChange');
	if (enableDynamicLoadTickChange) {
		let [loadNames, tickNames] = await findReference() || [];
		loadNames.forEach((loadName: string) => {
			changeThemeFilenames(loadName, "mcf_load");
		});
		tickNames.forEach((tickName: string) => {
			changeThemeFilenames(tickName, "mcf_tick");
		});
	} 
	const customLoadNames = workspace.getConfiguration().get<string>('mc-dp-icons.functionNamesForLoad');
	const customTickNames = workspace.getConfiguration().get<string>('mc-dp-icons.functionNamesForTick');

	if (!enableDynamicLoadTickChange && customLoadNames !== undefined || customTickNames !== undefined) {
		const loadNames = customLoadNames?.split(',').map(item => item.trim());
		const tickNames = customTickNames?.split(',').map(item => item.trim());
		const hasCommonName = loadNames?.some(item => tickNames?.includes(item));
		if (hasCommonName) {
			vscode.window.showWarningMessage('You have same names in custom tick / load icons configuration');
		}
		loadNames?.forEach((loadName: string) => {
			changeThemeFilenames(loadName + ".mcfunction", "mcf_load");
		});
		tickNames?.forEach((tickName: string) => {
			changeThemeFilenames(tickName + ".mcfunction", "mcf_tick");
		});
	}
}

/* 
:arg fileName: File for which you intend to modify the icon
:arg iconName: Name of the new icon 
*/
async function changeThemeFilenames(fileName: string, iconName: string) {
	const themePath = path.join(__dirname, '..', 'fileicons', 'mc-dp-icon-theme.json');
	const themeContent = fs.readFileSync(themePath, 'utf8');
	const themeObject = JSON.parse(themeContent);
	themeObject.fileNames[fileName] = iconName;
	const updatedThemeContent = JSON.stringify(themeObject, null, 2);
	fs.writeFileSync(themePath, updatedThemeContent, 'utf8');
}

// Convert fs.readFile into Promise version to use with async/await
const readFile = util.promisify(fs.readFile);

async function findReference() {
	const tickReference = await vscode.workspace.findFiles('**/tick.json', '**/node_modules/**');
	const loadReference = await vscode.workspace.findFiles('**/load.json', '**/node_modules/**');
	if (tickReference.length > 0 && loadReference.length > 0) {
		for (let [i, tickFile] of tickReference.entries()) {
			let loadFile = loadReference[i];
			let tickValues = await convertMcfunctionIdToFilename(tickFile);
			let loadValues = await convertMcfunctionIdToFilename(loadFile);
			return [loadValues, tickValues];
		}
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
async function convertMcfunctionIdToFilename(file: vscode.Uri) {
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
