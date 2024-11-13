"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const util_1 = __importDefault(require("util"));
const vscode_1 = require("vscode");
const subfolderNames = {
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
    trim_material: "trim_material_file",
    trim_pattern: "trim_pattern_file",
    wolf_variant: "wolf_variant_file",
    worldgen: "worldgen_file"
};
// This function is called in extension.ts
function update() {
    deleteTempIconDefinitions();
    loadTickChange();
    namespaceIcon();
    subfolderIcon();
    hideFolderArrows();
}
exports.update = update;
async function deleteTempIconDefinitions() {
    const themePath = path.join(__dirname, "..", "fileicons", "mc-dp-icon-theme.json");
    const defaultThemePath = path.join(__dirname, "..", "fileicons", "mc-dp-icon-theme-default.json");
    const defaultThemeContent = fs.readFileSync(defaultThemePath, "utf8");
    fs.writeFileSync(themePath, defaultThemeContent, "utf8");
}
// Set icons for functions referenced in tick.json | load.json accordingly
async function loadTickChange() {
    const enableDynamicLoadTickChange = vscode_1.workspace
        .getConfiguration()
        .get("mc-dp-icons.enableLoadTickAutoChange");
    if (enableDynamicLoadTickChange) {
        const [loadNames, tickNames] = (await getTickLoadNames()) || [];
        loadNames?.forEach((loadName) => {
            setThemeValue(["fileNames", loadName], "mcf_load");
        });
        tickNames?.forEach((tickName) => {
            setThemeValue(["fileNames", tickName], "mcf_tick");
        });
    }
    else {
        const customLoadNames = vscode_1.workspace
            .getConfiguration()
            .get("mc-dp-icons.functionNamesForLoad");
        const customTickNames = vscode_1.workspace
            .getConfiguration()
            .get("mc-dp-icons.functionNamesForTick");
        const hasCommonName = customLoadNames?.some((item) => customTickNames?.includes(item));
        if (hasCommonName) {
            vscode.window.showWarningMessage("You have same names in custom tick / load icons configuration");
        }
        customLoadNames?.forEach((loadName) => {
            setThemeValue(["fileNames", loadName + ".mcfunction"], "mcf_load");
        });
        customTickNames?.forEach((tickName) => {
            setThemeValue(["fileNames", tickName + ".mcfunction"], "mcf_tick");
        });
    }
}
// Use enderchest icon for namespaces
async function namespaceIcon() {
    const enableNamespaceIcons = vscode_1.workspace
        .getConfiguration()
        .get("mc-dp-icons.enableNamespaceIcons");
    if (!enableNamespaceIcons)
        return;
    let namespacePaths = getNamespacePaths() || [];
    const namespaceNames = namespacePaths.map((fullPath) => path.basename(fullPath));
    namespaceNames.forEach((namespace) => {
        setThemeValue(["folderNames", namespace], "namespace");
        setThemeValue(["folderNamesExpanded", namespace], "namespace_open");
    });
}
// Change icons of files in subfolders
async function subfolderIcon() {
    const subfolderIconEnabled = vscode_1.workspace
        .getConfiguration()
        .get("mc-dp-icons.enableSubfolderIcons");
    if (!subfolderIconEnabled)
        return;
    const subfolders = (await subfolderReference()) || {};
    Object.entries(subfolders).forEach(([key, value]) => {
        value.forEach((fileName) => {
            const fileIcon = subfolderNames[key];
            fileName = fileName.replace(/\\/g, "/");
            setThemeValue(["fileNames", fileName], fileIcon);
            console.log(`"${fileName}": "${fileIcon}"`);
        });
    });
}
async function hideFolderArrows() {
    const confHideFolderArrows = vscode_1.workspace
        .getConfiguration()
        .get("mc-dp-icons.hideFolderArrows");
    if (confHideFolderArrows) {
        setThemeValue("hidesExplorerArrows", true);
    }
    else {
        setThemeValue("hidesExplorerArrows", false);
    }
}
/**
 * Sets a nested key's value within the theme configuration.
 * @param keys - A string or array of strings representing the key path (e.g., "key" or ["key1", "key2"]).
 * @param value - The value to set at the specified key path.
 */
async function setThemeValue(keyName, value) {
    const themePath = path.join(__dirname, "..", "fileicons", "mc-dp-icon-theme.json");
    let themeContent = fs.readFileSync(themePath, "utf8");
    let themeObject = JSON.parse(themeContent);
    let currentKey = themeObject;
    if (Array.isArray(keyName)) {
        const lastKey = keyName[keyName.length - 1];
        keyName.forEach((key) => {
            if (key === lastKey) {
                currentKey[key] = value;
            }
            else {
                currentKey[key] || {};
                currentKey = currentKey[key];
            }
        });
    }
    else {
        currentKey[keyName] = value;
    }
    fs.writeFileSync(themePath, JSON.stringify(themeObject, null, 2), "utf8");
}
const readFile = util_1.default.promisify(fs.readFile);
/**
 * @returns {Array} of load function names and {Array} of tick function names
 */
async function getTickLoadNames() {
    const tickReference = await vscode.workspace.findFiles("**/tick.json", "**/node_modules/**");
    const loadReference = await vscode.workspace.findFiles("**/load.json", "**/node_modules/**");
    if (tickReference?.length > 0 || loadReference?.length > 0) {
        let loadNames = [];
        let tickNames = [];
        for (let i = 0; i < loadReference.length; i++) {
            let loadValue = await mcfIDtoFileName(loadReference[i]);
            loadNames = [...loadNames, ...loadValue];
        }
        for (let i = 0; i < tickReference.length; i++) {
            let tickValue = await mcfIDtoFileName(tickReference[i]);
            tickNames = [...tickNames, ...tickValue];
        }
        return [loadNames, tickNames];
    }
    else {
        console.log("tick.json or load.json not found");
        return [[], []];
    }
}
/**
 * Convert function id inside function tag file to filename
 * @param file - Function tag file
 */
async function mcfIDtoFileName(file) {
    const filePath = file.fsPath;
    const removeNamespace = (input) => {
        return input.split(":")[1];
    };
    try {
        const fileContent = await readFile(filePath, "utf8");
        const fileObject = JSON.parse(fileContent);
        const functionNotReferenced = fileObject.values?.length == 0;
        if (functionNotReferenced)
            return [];
        return fileObject.values.map((value) => `${removeNamespace(value)}.mcfunction`);
    }
    catch (err) {
        console.error(`Failed to read file: ${err}`);
        return [];
    }
}
/**
 * @returns {Array} of namespace paths
 */
function getNamespacePaths() {
    let packPaths = findMcmetaInWorkspace().map((packPath) => packPath.replace("pack.mcmeta", ""));
    if (!packPaths)
        return [];
    const namespacePaths = [];
    /** @returns {Array} of paths for every subdirectory in specified path */
    const getPaths = (path) => {
        if (!fs.existsSync(path))
            return [];
        return fs
            .readdirSync(path)
            .filter((file) => fs.statSync(`${path}/${file}`).isDirectory())
            .map((file) => `${path}/${file}`);
    };
    packPaths.forEach((packPath) => {
        try {
            namespacePaths.push(...getPaths(packPath + "data"));
            namespacePaths.push(...getPaths(packPath + "assets"));
        }
        catch (error) {
            console.error(`Error reading folder: ${packPath}data`, error);
        }
    });
    return namespacePaths;
}
/**
 * @returns {Object} mapping each subfolder to an array of files located within its subsubfolders.
 */
async function subfolderReference() {
    const subfolders = {};
    const namespacePaths = getNamespacePaths();
    namespacePaths.forEach((namespacePath) => {
        const namespaceFolderPath = path.join(namespacePath);
        if (fs.existsSync(namespaceFolderPath)) {
            const entries = fs.readdirSync(namespaceFolderPath, {
                withFileTypes: true,
            });
            entries.forEach((entry) => {
                const properDirectory = entry.isDirectory() && entry.name in subfolderNames;
                if (properDirectory) {
                    const subfolderPath = path.join(namespaceFolderPath, entry.name);
                    subfolders[entry.name] = getFilesInDirectory(subfolderPath);
                }
            });
        }
    });
    return subfolders;
}
/**
 * Helper function to retrieve all files in a directory and its subdirectories
 * @param directory - The directory you're retrieving all of the files from
 * @returns {Array} of files located within the directory
 */
function getFilesInDirectory(directory) {
    const files = [];
    const searchSubdirectory = (currentPath, relativePath = "") => {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });
        entries.forEach((entry) => {
            const fullPath = path.join(currentPath, entry.name);
            const filePath = path.join(relativePath, entry.name);
            if (entry.isDirectory()) {
                searchSubdirectory(fullPath, filePath);
            }
            else {
                const pathSegments = filePath.split(path.sep);
                if (pathSegments.length > 1) {
                    const shortenedPath = pathSegments.length > 2 // condition
                        ? pathSegments.slice(-2).join(path.sep) // if condition true
                        : filePath; // if condition false
                    files.push(shortenedPath.replace(/\\/g, "/"));
                }
            }
        });
    };
    searchSubdirectory(directory);
    return files;
}
/**
 * @returns {Array} of pack.mcmeta paths in this workspace
 */
function findMcmetaInWorkspace() {
    let mcmetaPaths = [];
    const directories = vscode.workspace.workspaceFolders?.map((folder) => folder.uri.fsPath) || [];
    directories.forEach((directory) => {
        mcmetaPaths = mcmetaPaths.concat(findMcmetaInDirectory(directory));
    });
    return mcmetaPaths;
}
/**
 * @returns {Array} of pack.mcmeta paths in specified directory
 */
function findMcmetaInDirectory(directory) {
    const files = fs.readdirSync(directory);
    let mcmetaPaths = [];
    files.forEach((fileName) => {
        const filePath = path.join(directory, fileName);
        if (fs.statSync(filePath).isDirectory()) {
            mcmetaPaths = mcmetaPaths.concat(findMcmetaInDirectory(filePath));
        }
        else if (fileName === "pack.mcmeta") {
            mcmetaPaths.push(filePath);
        }
    });
    return mcmetaPaths;
}
//# sourceMappingURL=dynamic_icons.js.map