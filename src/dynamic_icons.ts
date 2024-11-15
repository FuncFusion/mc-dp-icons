import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import util from "util";
import { workspace } from "vscode";
import { json } from "stream/consumers";
import { isObject } from "lodash";

const subfolderIconMap: Record<string, string> = {
	// Datapacks
	advancement: "advancement_file",
	advancements: "advancement_file",
	banner_pattern: "banner_pattern_file",
	damage_type: "damage_type_file",
	dimension: "dimension_file",
	dimension_type: "dimension_type_file",
	enchantment: "enchantment_file",
	enchantment_provider: "enchantment_file",
	item_modifier: "item_modifier_file",
	item_modifiers: "item_modifier_file",
	instrument: "instrument_file",
	jukebox_song: "jukebox_song_file",
	loot_table: "loot_table_file",
	loot_tables: "loot_table_file",
	painting_variant: "image",
	predicate: "predicate_file",
	predicates: "predicate_file",
	recipe: "recipe_file",
	recipes: "recipe_file",
	tags: "tags_file",
	trial_spawner: "trial_spawner_file",
	trim_material: "trim_material_file",
	trim_pattern: "trim_pattern_file",
	wolf_variant: "wolf_variant_file",
	worldgen: "worldgen_file",
	// Resourcepacks
	font: "ttf",
	models: "models_file",
	post_effect: "shaders_file",
	shaders: "shaders_file",
	// Bedrock behavior packs
	animation_controllers: "animations_file",
	animations: "animations_file",
	blocks: "blocks_file",
	cameras: "cameras_file",
	entities: "entities_file",
	features: "features_file",
	feature_rules: "features_file",
	dialogue: "chat_type_file",
	trading: "trading_file",
	// Bedrock resource packs
	attachables: "attachables_file",
	entity: "entities_file",
	fogs: "fogs_file",
	ui: "ui_file",
};

// This function is called in extension.ts
export function update() {
	resetIconDefinitions();
	applyFolderArrowsSettings();
	updateLoadTickIcons();
	setNamespaceIcons();
	setSubFolderIcons();
}

async function resetIconDefinitions() {
	const themePath = path.join(
		__dirname,
		"..",
		"fileicons",
		"mc-dp-icon-theme.json",
	);
	const defaultThemePath = path.join(
		__dirname,
		"..",
		"fileicons",
		"mc-dp-icon-theme-default.json",
	);
	fs.copyFileSync(defaultThemePath, themePath);
}

// Set icons for functions referenced in tick.json | load.json accordingly
async function updateLoadTickIcons() {
	const enableDynamicLoadTickChange = getConfig("enableLoadTickAutoChange");
	if (enableDynamicLoadTickChange) {
		const [loadNames, tickNames] = (await getTickLoadNames()) || [];
		loadNames?.forEach((loadName: string) => {
			setThemeValue(["fileNames", loadName], "mcf_load");
		});
		tickNames?.forEach((tickName: string) => {
			setThemeValue(["fileNames", tickName], "mcf_tick");
		});
	} else {
		const customLoadNames = getConfig("functionNamesForLoad");
		const customTickNames = getConfig("functionNamesForTick");
		const hasCommonName = customLoadNames?.some((item: string) =>
			customTickNames?.includes(item),
		);
		if (hasCommonName) {
			vscode.window.showWarningMessage(
				"You have same names in custom tick / load icons configuration",
			);
		}
		customLoadNames?.forEach((loadName: string) => {
			setThemeValue(["fileNames", loadName + ".mcfunction"], "mcf_load");
		});
		customTickNames?.forEach((tickName: string) => {
			setThemeValue(["fileNames", tickName + ".mcfunction"], "mcf_tick");
		});
	}
}

// Use enderchest icon for namespaces
async function setNamespaceIcons() {
	const enableNamespaceIcons = getConfig("enableNamespaceIcons");

	if (!enableNamespaceIcons) return;

	let namespacePaths: string[] = getNamespacePaths() || [];
	const namespaceNames = namespacePaths.map((fullPath) => {
		const pathSegments = fullPath.split(path.sep);
		return path.join(...pathSegments.slice(-1)).replace(/\\/g, "/");
	});
	const folderNamesIconsMap: Record<string, string> = {};
	const folderNamesExpandedIconsMap: Record<string, string> = {};

	namespaceNames.forEach((namespace: string) => {
		folderNamesIconsMap[namespace] = "namespace";
		folderNamesExpandedIconsMap[namespace] = "namespace_open";
	});
	setThemeValue("folderNames", folderNamesIconsMap);
	setThemeValue("folderNamesExpanded", folderNamesExpandedIconsMap);
}

// Change icons of files in subfolders
async function setSubFolderIcons() {
	const subfolderIconEnabled = getConfig("enableSubfolderIcons");
	if (!subfolderIconEnabled) return;
	const subfolderToFilesMap = (await subfolderReference()) || {};
	const subfolderFilesToIconsMap: Record<string, string> = {};

	Object.entries(subfolderToFilesMap).forEach(([key, value]) => {
		value.forEach((fileName: string) => {
			const fileIcon = subfolderIconMap[key];
			subfolderFilesToIconsMap[fileName] = fileIcon;
		});
	});
	setThemeValue("fileNames", subfolderFilesToIconsMap);
}

async function applyFolderArrowsSettings() {
	const confHideFolderArrows = getConfig("hideFolderArrows");
	if (confHideFolderArrows) {
		setThemeValue("hidesExplorerArrows", true);
	} else {
		setThemeValue("hidesExplorerArrows", false);
	}
}

/**
 * Sets a nested key's value within the theme configuration.
 * @param keys - A string or array of strings representing the key path (e.g., "key" or ["key1", "key2"]).
 * @param value - The value to set at the specified key path.
 */
async function setThemeValue(keyName: string | string[], value: any) {
	const themePath = path.join(
		__dirname,
		"..",
		"fileicons",
		"mc-dp-icon-theme.json",
	);
	let themeContent = fs.readFileSync(themePath, "utf8");
	let themeObject = JSON.parse(themeContent);
	let currentKey = themeObject;
	const setValue = (key: string, value: any) => {
		if (isObject(value)) {
			currentKey[key] = {
				...currentKey[key],
				...value,
			};
		} else {
			currentKey[key] = value;
		}
	};

	if (Array.isArray(keyName)) {
		const lastKey = keyName[keyName.length - 1];

		keyName.forEach((key) => {
			if (key === lastKey) {
				setValue(key, value);
			} else {
				currentKey[key] || {};
				currentKey = currentKey[key];
			}
		});
	} else {
		setValue(keyName, value);
	}
	fs.writeFileSync(themePath, JSON.stringify(themeObject, null, 2), "utf8");
}

const readFile = util.promisify(fs.readFile);

/**
 * @returns {Array} of load function names and {Array} of tick function names
 */
async function getTickLoadNames(): Promise<[string[], string[]]> {
	const tickReference = await vscode.workspace.findFiles(
		"**/tick.json",
		"**/node_modules/**",
	);
	const loadReference = await vscode.workspace.findFiles(
		"**/load.json",
		"**/node_modules/**",
	);
	if (tickReference?.length > 0 || loadReference?.length > 0) {
		let loadNames: string[] = [];
		let tickNames: string[] = [];
		for (let i = 0; i < loadReference.length; i++) {
			let loadValue = await mcfIDtoFileName(loadReference[i]);
			loadNames = [...loadNames, ...loadValue];
		}
		for (let i = 0; i < tickReference.length; i++) {
			let tickValue = await mcfIDtoFileName(tickReference[i]);
			tickNames = [...tickNames, ...tickValue];
		}
		return [loadNames, tickNames];
	} else {
		return [[], []];
	}
}

/**
 * Convert function id inside function tag file to filename
 * @param file - Function tag file
 */
async function mcfIDtoFileName(file: vscode.Uri): Promise<string[]> {
	const filePath = file.fsPath;
	const removeNamespace = (input: string) => {
		return input.split(":")[1];
	};

	try {
		const fileContent = await readFile(filePath, "utf8");
		const fileObject = JSON.parse(fileContent);
		const functionNotReferenced = fileObject.values?.length == 0;

		if (functionNotReferenced) return [];

		return fileObject.values.map(
			(value: string) => `${removeNamespace(value)}.mcfunction`,
		);
	} catch (err) {
		console.error(`Failed to read file: ${err}`);
		return [];
	}
}

/**
 * @returns {Array} of namespace paths
 */
function getNamespacePaths(): string[] {
	let packPaths = findMcmetaInWorkspace().map((packPath) =>
		packPath.replace("pack.mcmeta", ""),
	);
	if (!packPaths) return [];
	const namespacePaths: string[] = [];

	/** @returns {Array} of paths for every subdirectory in specified path */
	const getPaths = (path: string): string[] => {
		if (!fs.existsSync(path)) return [];
		return fs
			.readdirSync(path)
			.filter((file) => fs.statSync(`${path}/${file}`).isDirectory())
			.map((file) => `${path}/${file}`);
	};

	packPaths.forEach((packPath) => {
		try {
			namespacePaths.push(...getPaths(packPath + "data"));
			namespacePaths.push(...getPaths(packPath + "assets"));
		} catch (error) {
			console.error(`Error reading folder: ${packPath}data`, error);
		}
	});

	return namespacePaths;
}

/**
 * @returns {Object} mapping each subfolder to an array of files located within its subsubfolders.
 */
async function subfolderReference(): Promise<{ [key: string]: string[] }> {
	const subfolders: { [key: string]: string[] } = {};
	const namespacePaths = getNamespacePaths();
	let filesAmount = 0;

	namespacePaths.forEach((namespacePath) => {
		const namespaceFolderPath = path.join(namespacePath);

		if (fs.existsSync(namespaceFolderPath)) {
			const entries = fs.readdirSync(namespaceFolderPath, {
				withFileTypes: true,
			});
			entries.forEach((entry) => {
				const properDirectory =
					entry.isDirectory() && entry.name in subfolderIconMap;

				if (properDirectory) {
					const subfolderPath = path.join(namespaceFolderPath, entry.name);
					const files = getFilesInDirectory(subfolderPath);
					filesAmount += files.length;

					if (subfolders[entry.name]) {
						subfolders[entry.name].push(...files);
					} else {
						subfolders[entry.name] = files;
					}
				}
			});
		}
	});
	if (filesAmount >= 2000) {
		vscode.window.showWarningMessage(
			"Too many files in subsubfolders (Over 2000). Subsubfolder icons feature might not work properly.",
		);
	}
	return subfolders;
}

/**
 * Helper function to retrieve all files in a directory and its subdirectories
 * @param directory - The directory you're retrieving all of the files from
 * @returns {Array} of files located within the directory
 */
function getFilesInDirectory(directory: string): string[] {
	const files: string[] = [];
	const collectFiles = (dir: string, relativePath = "") => {
		const entries = fs.readdirSync(dir, { withFileTypes: true });
		entries.forEach((entry) => {
			const fullPath = path.join(dir, entry.name);
			const newPath = path.join(relativePath, entry.name);
			const fileInSubfolder =
				newPath.split(path.sep).length > 1 && newPath.endsWith(".json");

			if (entry.isDirectory()) {
				collectFiles(fullPath, newPath);
			} else if (fileInSubfolder) {
				const shortenedPath =
					newPath.split(path.sep).length > 2
						? newPath.split(path.sep).slice(-2).join(path.sep)
						: newPath;

				files.push(shortenedPath.replace(/\\/g, "/"));
			}
		});
	};
	collectFiles(directory);
	return files;
}

/**
 * @returns {Array} of pack.mcmeta paths in this workspace
 */
function findMcmetaInWorkspace(): string[] {
	let mcmetaPaths: string[] = [];
	const directories =
		vscode.workspace.workspaceFolders?.map((folder) => folder.uri.fsPath) || [];

	directories.forEach((directory) => {
		mcmetaPaths = mcmetaPaths.concat(findMcmetaInDirectory(directory));
	});

	return mcmetaPaths;
}

/**
 * @returns {Array} of pack.mcmeta paths in specified directory
 */
function findMcmetaInDirectory(directory: string): string[] {
	const files = fs.readdirSync(directory);
	let mcmetaPaths: string[] = [];

	files.forEach((fileName) => {
		const filePath = path.join(directory, fileName);

		if (fs.statSync(filePath).isDirectory()) {
			mcmetaPaths = mcmetaPaths.concat(findMcmetaInDirectory(filePath));
		} else if (fileName === "pack.mcmeta") {
			mcmetaPaths.push(filePath);
		}
	});

	return mcmetaPaths;
}

function getConfig(name: string): any {
	return workspace.getConfiguration().get(`mc-dp-icons.${name}`);
}
