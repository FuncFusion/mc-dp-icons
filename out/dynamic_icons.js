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
// This function is called in extension.ts
function update() {
    deleteTempIconDefinitions();
    loadTickChange();
    namespaceIcon();
}
exports.update = update;
// Give namespaces an enderchest icon.
async function namespaceIcon() {
    const enableNamespaceIcons = vscode_1.workspace.getConfiguration().get('mc-dp-icons.enableNamespaceIcons');
    if (enableNamespaceIcons) {
        const themePath = path.join(__dirname, '..', 'fileicons', 'mc-dp-icon-theme.json');
        let namespaceNames = getNamespaceNames() || [];
        const themeContent = fs.readFileSync(themePath, "utf-8");
        const themeObject = JSON.parse(themeContent);
        namespaceNames.forEach((namespace) => {
            themeObject.folderNames[namespace] = "namespace";
            themeObject.folderNamesExpanded[namespace] = "namespace_open";
        });
        const updatedThemeContent = JSON.stringify(themeObject, null, 2);
        fs.writeFileSync(themePath, updatedThemeContent, 'utf-8');
    }
}
// Give icons to functions referenced in tick.json | load.json accordingly
async function loadTickChange() {
    const enableLoadTickChange = vscode_1.workspace.getConfiguration().get('mc-dp-icons.enableLoadTickAutoChange');
    if (enableLoadTickChange) {
        const themePath = path.join(__dirname, '..', 'fileicons', 'mc-dp-icon-theme.json');
        let [loadValues, tickValues] = await findReference() || [];
        const themeContent = fs.readFileSync(themePath, 'utf8');
        const themeObject = JSON.parse(themeContent);
        tickValues.forEach((function_name) => {
            themeObject.fileNames[function_name] = "mcf_tick";
        });
        loadValues.forEach((function_name) => {
            themeObject.fileNames[function_name] = "mcf_load";
        });
        const updatedThemeContent = JSON.stringify(themeObject, null, 2);
        fs.writeFileSync(themePath, updatedThemeContent, 'utf8');
    }
}
// Convert fs.readFile into Promise version to use with async/await
const readFile = util_1.default.promisify(fs.readFile);
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
    }
    else {
        console.log('tick.json or load.json not found');
    }
}
async function deleteTempIconDefinitions() {
    const themePath = path.join(__dirname, '..', 'fileicons', 'mc-dp-icon-theme.json');
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
    const updatedThemeContent = JSON.stringify(themeObject, null, 2);
    fs.writeFileSync(themePath, updatedThemeContent, 'utf8');
}
/*
:arg file: tick.json | load.json file path
:return: An array of tick & load MCfunctions file names
*/
async function convertMcfunctionIdToFilename(file) {
    const tickJsonPath = file.fsPath;
    const removeNamespaceFromMCfunctionID = (input) => { return input.split(':')[1]; };
    try {
        const data = await readFile(tickJsonPath, 'utf8');
        const tickJson = JSON.parse(data);
        const isFunctionReferenced = tickJson.values?.length > 0;
        if (isFunctionReferenced) {
            return tickJson.values.map((value) => `${removeNamespaceFromMCfunctionID(value)}.mcfunction`);
        }
        else {
            console.log('No values found');
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
    ;
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
/*
:arg directory: Path of a folder that function will search in
:return: An array of paths leading to pack.mcmeta
*/
function findMcmetaInWorkspace() {
    let mcmetaPaths = [];
    const directories = vscode.workspace.workspaceFolders?.map(folder => folder.uri.fsPath) || [];
    directories.forEach(directory => {
        mcmetaPaths = mcmetaPaths.concat(findMcmetaInDirectory(directory));
    });
    console.log('brbr ' + mcmetaPaths);
    return mcmetaPaths;
}
function findMcmetaInDirectory(directory) {
    const files = fs.readdirSync(directory);
    let mcmetaPaths = [];
    files.forEach(file => {
        const filePath = `${directory}/${file}`;
        if (fs.statSync(filePath).isDirectory()) {
            mcmetaPaths = mcmetaPaths.concat(findMcmetaInDirectory(filePath));
        }
        else if (file === 'pack.mcmeta') {
            mcmetaPaths.push(filePath);
        }
    });
    return mcmetaPaths;
}
//# sourceMappingURL=dynamic_icons.js.map