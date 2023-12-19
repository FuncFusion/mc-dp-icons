import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import util from 'util';
import { workspace } from 'vscode';

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

async function loadTickChange() {
	const enableLoadTickChange = workspace.getConfiguration().get<boolean>('mc-dp-icons.enableLoadTickAutoChange');
	if (enableLoadTickChange) {
		const themePath = path.join(__dirname, '..', 'fileicons', 'mc-dp-icon-theme.json');
		let [loadValues, tickValues] = await findReference() || [];
		const themeContent = fs.readFileSync(themePath, 'utf8');
		const themeObject = JSON.parse(themeContent);
		tickValues.forEach((function_name:string) => {
			themeObject.fileNames[function_name] = "mcf_tick";
		});
		loadValues.forEach((function_name:string) => {
			themeObject.fileNames[function_name] = "mcf_load";
		});
		// Convert the JavaScript object back into a JSON string and write it back into file 
		const updatedThemeContent = JSON.stringify(themeObject, null, 2);
		fs.writeFileSync(themePath, updatedThemeContent, 'utf8');
	}
}

// Convert fs.readFile and fs.writeFile into Promise version to use with async/await
const readFile = util.promisify(fs.readFile);

function removeFirstPart(input: string): string {return input.split(':')[1]; }
	
async function findReference() {
	const tickReference = await vscode.workspace.findFiles('**/tick.json', '**/node_modules/**');
	const loadReference = await vscode.workspace.findFiles('**/load.json', '**/node_modules/**');
	if (tickReference.length > 0 && loadReference.length > 0) {
		for (let [i, tickFile] of tickReference.entries()) {
			let loadFile = loadReference[i];
			let tickValues = await processFile(tickFile);
			let loadValues = await processFile(loadFile);
			return [loadValues, tickValues];
		}
	} else {
		console.log('tick.json or load.json not found');
	}
}
	
async function deleteTempIconDefinitions() {
	// Get the absolute path to mc-dp-icon-theme.json
	const themePath = path.join(__dirname, '..', 'fileicons', 'mc-dp-icon-theme.json');
	// Parse content of mc-dp-icon-theme.json
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
	// Convert the JavaScript object back into a JSON string and write it back into file 
	const updatedThemeContent = JSON.stringify(themeObject, null, 2);
	fs.writeFileSync(themePath, updatedThemeContent, 'utf8');
}
	
async function processFile(file: vscode.Uri) {
	const tickJsonPath = file.fsPath;
	try {
		const data = await readFile(tickJsonPath, 'utf8');
		const tickJson = JSON.parse(data);
		
		if (tickJson.values?.length > 0) {
			return tickJson.values.map((value: string) => `${removeFirstPart(value)}.mcfunction`);
		} else {
			console.log('No values found');
			return [];
		}
	} catch (err) {
		console.error(`Failed to read file: ${err}`);
		return [];
	}
}
	

function getNamespaceNames(): string[] {
	let packMcmetaPaths = findPackMcmetaInFolders().map((packPath) => packPath.replace("pack.mcmeta", ""));
	const folderNames: string[] = [];

	const getDirectories = (path: string) => {
		if (fs.existsSync(path)) {
			fs.readdirSync(path)
				.filter((file) => fs.statSync(`${path}/${file}`).isDirectory())
				.forEach((file) => folderNames.push(file));
		}
	};

	if (packMcmetaPaths) {
		packMcmetaPaths.forEach((packPath) => {
			try {
				getDirectories(packPath + "data");
				getDirectories(packPath + "assets");
			} catch (error) {
				console.error(`Error reading folder: ${packPath}data`, error);
			}
		});
	}

	return folderNames;
}


function findPackMcmetaInFolders(directory?: string): string[] {
	const packMcmetaPaths: string[] = [];
	const directories = directory ? [directory] : vscode.workspace.workspaceFolders?.map(folder => folder.uri.fsPath) || [];

	directories.forEach((directory) => {
		const files = fs.readdirSync(directory);

		for (const file of files) {
			const filePath = `${directory}/${file}`;

			if (fs.statSync(filePath).isDirectory()) {
				const packMcmetaPath = findPackMcmetaInFolders(filePath);
				if (packMcmetaPath) {
					packMcmetaPaths.push(...packMcmetaPath);
				}
			} else {
				if (file === 'pack.mcmeta') {
					packMcmetaPaths.push(filePath);
				}
			}
		}
	});

	return packMcmetaPaths;
}



export function update() {
	deleteTempIconDefinitions();
	loadTickChange();
	namespaceIcon();
}