import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import util from 'util';
import { workspace } from 'vscode';

async function namespaceIcon() {
		const enableNamespaceIcons = workspace.getConfiguration().get<boolean>('mc-dp-icons.enableNamespaceIcons');
		if (enableNamespaceIcons) { 
				console.log('starting namespaceIcon func');
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
				if (themeObject.fileNames[key] === "mcf_tick" || themeObject.fileNames[key] === "mcf_load") {
						delete themeObject.fileNames[key];
				}
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
					
					if (tickJson.values && tickJson.values.length > 0) {
							let values = tickJson.values;
				values = values.map(removeFirstPart);
				values = values.map((value: string) => value += ".mcfunction");
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

function getNamespaceNames(): string[] {
	console.log('starting getNamespaceNames func');
	// const workspaceFolders = vscode.workspace.workspaceFolders;
	let packMcmetaPaths = findPackMcmetaInFolders();
	packMcmetaPaths = packMcmetaPaths.map((packPath) => {
		packPath = packPath.replace("pack.mcmeta", "");
		return packPath;
	});
	const folderNames: string[] = [];

	if (packMcmetaPaths) {
		packMcmetaPaths.forEach((packPath) => {;
			const dataFolderPath = packPath + "data";
			const assetsFolderPath = packPath + "assets";
			const dataFolderExist = fs.existsSync(dataFolderPath);
			const assetsFolderExist = fs.existsSync(assetsFolderPath);
			try {
				if (dataFolderExist) {
					const dataFiles = fs.readdirSync(dataFolderPath);
					dataFiles.forEach((file) => {
						const filePath = `${dataFolderPath}/${file}`;
						const isDirectory = fs.statSync(filePath).isDirectory();
	
						if (isDirectory) {
							folderNames.push(file);
						}
					});
				}
				if (assetsFolderExist){
					const assetsFiles = fs.readdirSync(assetsFolderPath);
					assetsFiles.forEach((file) => {
						const filePath = `${assetsFolderPath}/${file}`;
						const isDirectory = fs.statSync(filePath).isDirectory();
	
						if (isDirectory) {
							folderNames.push(file);
						}
					});
				}

			} catch (error) {
				console.error(`Error reading folder: ${dataFolderPath}`, error);
			}
		});
	}

	return folderNames;
}

export function findPackMcmetaInFolders(): string[] {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		const packMcmetaPaths: string[] = [];
	
		if (workspaceFolders) {
			workspaceFolders.forEach((folder) => {
				const folderPath = folder.uri.fsPath;
				const packMcmetaPath = findPackMcmeta(folderPath);
	
				if (packMcmetaPath) {
					packMcmetaPaths.push(packMcmetaPath);
				}
			});
		}
		return packMcmetaPaths;
	}
	
	function findPackMcmeta(directory: string): string | undefined {
		const files = fs.readdirSync(directory);
	
		for (const file of files) {
			const filePath = `${directory}/${file}`;
			const isDirectory = fs.statSync(filePath).isDirectory();
	
			if (isDirectory) {
				const packMcmetaPath = findPackMcmeta(filePath);
	
				if (packMcmetaPath) {
					return packMcmetaPath;
				}
			} else {
				if (file === 'pack.mcmeta') {
					return filePath;
				}
			}
		}
	
		return undefined;
	}


	export function update() {
		deleteTempIconDefinitions();
		loadTickChange();
		namespaceIcon();
	}