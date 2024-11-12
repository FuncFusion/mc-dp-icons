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
    advancements: "pack_mcmeta",
    advancement: "pack_mcmeta",
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
async function hideFolderArrows() {
    const confHideFolderArrows = vscode_1.workspace
        .getConfiguration()
        .get("mc-dp-icons.hideFolderArrows");
    if (confHideFolderArrows) {
        modifyTheme("hidesExplorerArrows", true);
    }
    else {
        modifyTheme("hidesExplorerArrows", false);
    }
}
// Give namespaces an enderchest icon.
async function namespaceIcon() {
    const enableNamespaceIcons = vscode_1.workspace
        .getConfiguration()
        .get("mc-dp-icons.enableNamespaceIcons");
    if (!enableNamespaceIcons)
        return;
    let namespaceNames = getNamespaceNames() || [];
    namespaceNames.forEach((namespace) => {
        modifyTheme(["folderNames", namespace], "namespace");
        modifyTheme(["folderNamesExpanded", namespace], "namespace_open");
    });
}
async function subfolderIcon() {
    // const subfolderIconEnabled = workspace
    // 	.getConfiguration()
    // 	.get<boolean>("mc-dp-icons.enableSubfolderIcons");
    const subfolderIconEnabled = true;
    if (!subfolderIconEnabled)
        return;
    const subfolders = (await subfolderReference()) || {};
    Object.entries(subfolders).forEach(([key, value]) => {
        value.forEach((fileName) => {
            const fileIcon = subfolderNames[key];
            fileName = fileName.replace(/\\/g, "/");
            modifyTheme(["fileNames", fileName], fileIcon);
            console.log(`"${fileName}": "${fileIcon}"`);
        });
    });
}
// Give icons to functions referenced in tick.json | load.json accordingly
async function loadTickChange() {
    const enableDynamicLoadTickChange = vscode_1.workspace
        .getConfiguration()
        .get("mc-dp-icons.enableLoadTickAutoChange");
    if (enableDynamicLoadTickChange) {
        const [loadNames, tickNames] = (await findReference()) || [];
        loadNames?.forEach((loadName) => {
            modifyTheme(["fileNames", loadName], "mcf_load");
        });
        tickNames?.forEach((tickName) => {
            modifyTheme(["fileNames", tickName], "mcf_tick");
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
            modifyTheme(["fileNames", loadName + ".mcfunction"], "mcf_load");
        });
        customTickNames?.forEach((tickName) => {
            modifyTheme(["fileNames", tickName + ".mcfunction"], "mcf_tick");
        });
    }
}
/*
:arg keyName: Name of file / folder you intend to modify the icon of
:arg value: Value assigned to keyName
*/
async function modifyTheme(keyName, value) {
    const themePath = path.join(__dirname, "..", "fileicons", "mc-dp-icon-theme.json");
    let themeContent = fs.readFileSync(themePath, "utf8");
    let themeObject = JSON.parse(themeContent), current = themeObject;
    if (Array.isArray(keyName)) {
        for (let i = 0; i < keyName.length; i++) {
            current[keyName[i]] =
                i === keyName.length - 1 ? value : current[keyName[i]] || {};
            if (i !== keyName.length - 1) {
                current = current[keyName[i]];
            }
        }
    }
    else {
        current[keyName] = value;
    }
    fs.writeFileSync(themePath, JSON.stringify(themeObject, null, 2), "utf8");
}
const readFile = util_1.default.promisify(fs.readFile);
// Returns two arrays with mcfunction names of load and tick functions
async function findReference() {
    const tickReference = await vscode.workspace.findFiles("**/tick.json", "**/node_modules/**");
    const loadReference = await vscode.workspace.findFiles("**/load.json", "**/node_modules/**");
    if (tickReference?.length > 0 || loadReference?.length > 0) {
        let loadNames = [];
        let tickNames = [];
        for (let i = 0; i < loadReference.length; i++) {
            let loadValue = await convertMcfunctionIdToFilename(loadReference[i]);
            loadNames = [...loadNames, ...loadValue];
        }
        for (let i = 0; i < tickReference.length; i++) {
            let tickValue = await convertMcfunctionIdToFilename(tickReference[i]);
            tickNames = [...tickNames, ...tickValue];
        }
        return [loadNames, tickNames];
    }
    else {
        console.log("tick.json or load.json not found");
    }
}
async function deleteTempIconDefinitions() {
    const themePath = path.join(__dirname, "..", "fileicons", "mc-dp-icon-theme.json");
    const defaultThemePath = path.join(__dirname, "..", "fileicons", "mc-dp-icon-theme-default.json");
    const defaultThemeContent = fs.readFileSync(defaultThemePath, "utf8");
    fs.writeFileSync(themePath, defaultThemeContent, "utf8");
}
/*
:arg file: tick.json | load.json file path
:return: An array of tick & load MCfunctions file names
*/
async function convertMcfunctionIdToFilename(file) {
    const tickJsonPath = file.fsPath;
    const removeNamespaceFromMCfunctionID = (input) => {
        return input.split(":")[1];
    };
    try {
        const data = await readFile(tickJsonPath, "utf8");
        const tickJson = JSON.parse(data);
        const isFunctionReferenced = tickJson.values?.length > 0;
        if (isFunctionReferenced) {
            return tickJson.values.map((value) => `${removeNamespaceFromMCfunctionID(value)}.mcfunction`);
        }
        else {
            console.log("No values found");
            return [];
        }
    }
    catch (err) {
        console.error(`Failed to read file: ${err}`);
        return [];
    }
}
// :return: An array of namespace names in a pack
function getNamespaceNames() {
    let mcmetaPaths = findMcmetaInWorkspace().map((packPath) => packPath.replace("pack.mcmeta", ""));
    const folderNames = [];
    // :return: array of names of every folder inside given directory
    const getDirectories = (path) => {
        if (!fs.existsSync(path)) {
            return [];
        }
        fs.readdirSync(path)
            .filter((file) => fs.statSync(`${path}/${file}`).isDirectory())
            .forEach((file) => folderNames.push(file));
    };
    if (!mcmetaPaths) {
        return [];
    }
    mcmetaPaths.forEach((packPath) => {
        try {
            getDirectories(packPath + "data");
            getDirectories(packPath + "assets");
        }
        catch (error) {
            console.error(`Error reading folder: ${packPath}data`, error);
        }
    });
    return folderNames;
}
function getNamespacePaths() {
    let mcmetaPaths = findMcmetaInWorkspace().map((packPath) => packPath.replace("pack.mcmeta", ""));
    const namespacePaths = [];
    // :return: array of names of every folder inside given directory
    const getDirectories = (path) => {
        if (!fs.existsSync(path)) {
            return [];
        }
        return fs
            .readdirSync(path)
            .filter((file) => fs.statSync(`${path}/${file}`).isDirectory())
            .map((file) => `${path}/${file}`);
    };
    if (!mcmetaPaths) {
        return [];
    }
    mcmetaPaths.forEach((packPath) => {
        try {
            namespacePaths.push(...getDirectories(packPath + "data"));
            namespacePaths.push(...getDirectories(packPath + "assets"));
        }
        catch (error) {
            console.error(`Error reading folder: ${packPath}data`, error);
        }
    });
    return namespacePaths;
}
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
// Helper function to retrieve all files in a directory and its subdirectories
function getFilesInDirectory(directory) {
    const files = [];
    function searchSubdirectory(currentPath, relativePath = "") {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });
        entries.forEach((entry) => {
            const fullPath = path.join(currentPath, entry.name);
            const filePath = path.join(relativePath, entry.name);
            if (entry.isDirectory()) {
                searchSubdirectory(fullPath, filePath);
            }
            else {
                const pathSegments = filePath.split(path.sep);
                const shortenedPath = pathSegments.length > 2
                    ? pathSegments.slice(-2).join(path.sep)
                    : filePath;
                files.push(shortenedPath.replace(/\\/g, "/"));
            }
        });
    }
    searchSubdirectory(directory);
    return files;
}
// :return: An array of paths leading to pack.mcmeta
function findMcmetaInWorkspace() {
    let mcmetaPaths = [];
    const directories = vscode.workspace.workspaceFolders?.map((folder) => folder.uri.fsPath) || [];
    directories.forEach((directory) => {
        mcmetaPaths = mcmetaPaths.concat(findMcmetaInDirectory(directory));
    });
    return mcmetaPaths;
}
// :arg directory: Directory that will be searched for pack.mcmeta files
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