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
async function dynamicLoadTickChange() {
    // const enableLoadTickChange = workspace.getConfiguration().get<boolean>('mc-dp-icons.enableLoadTickAutoChange');
    console.log('dynamic load tick function RAN ong');
    const enableLoadTickChange = true;
    if (enableLoadTickChange) {
        console.log('load tick change is enabled!');
        // Get the absolute path to mc-dp-icon-theme.json
        const themePath = path.join(__dirname, '..', 'fileicons', 'mc-dp-icon-theme.json');
        console.log(themePath);
        let [loadValues, tickValues] = await findReference() || [];
        // Parse content of mc-dp-icon-theme.json
        const themeContent = fs.readFileSync(themePath, 'utf8');
        const themeObject = JSON.parse(themeContent);
        // Modify the mcfunction icon from cb_chain to misc
        tickValues.forEach((function_name) => {
            themeObject.fileNames[function_name] = "mcf_tick";
            console.log('changed ' + function_name);
        });
        loadValues.forEach((function_name) => {
            themeObject.fileNames[function_name] = "mcf_load";
            console.log('changed ' + function_name);
        });
        // Convert the JavaScript object back into a JSON string and write it back into file 
        const updatedThemeContent = JSON.stringify(themeObject, null, 2);
        fs.writeFileSync(themePath, updatedThemeContent, 'utf8');
    }
    else {
        console.log('load tick change is not enabled.');
    }
}
// Convert fs.readFile and fs.writeFile into Promise version to use with async/await
const readFile = util_1.default.promisify(fs.readFile);
function removeFirstPart(input) { return input.split(':')[1]; }
async function findReference() {
    const tickReference = await vscode.workspace.findFiles('**/tick.json', '**/node_modules/**');
    const loadReference = await vscode.workspace.findFiles('**/load.json', '**/node_modules/**');
    if (tickReference.length > 0 && loadReference.length > 0) {
        for (const [i, tickFile] of tickReference.entries()) {
            let loadFile = loadReference[i];
            let tickValues = await processFile(tickFile);
            let loadValues = await processFile(loadFile);
            console.log("load values: " + loadValues);
            console.log("tick values: " + tickValues);
            return [loadValues, tickValues];
        }
    }
    else {
        console.log('tick.json or load.json not found');
    }
}
async function processFile(file) {
    const tickJsonPath = file.fsPath;
    try {
        const data = await readFile(tickJsonPath, 'utf8');
        const tickJson = JSON.parse(data);
        if (tickJson.values && tickJson.values.length > 0) {
            let values = tickJson.values;
            values = values.map(removeFirstPart);
            values = values.map((value) => value += ".mcfunction");
            console.log("values array: " + values);
            return values;
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
async function deleteTempIconDefinitions() {
    // Get the absolute path to mc-dp-icon-theme.json
    const themePath = path.join(__dirname, '..', 'fileicons', 'mc-dp-icon-theme.json');
    // Parse content of mc-dp-icon-theme.json
    const themeContent = fs.readFileSync(themePath, 'utf8');
    const themeObject = JSON.parse(themeContent);
    for (let key in themeObject.fileNames) {
        if (themeObject.fileNames[key] === "mcf_tick" || themeObject.fileNames[key] === "mcf_load") {
            delete themeObject.fileNames[key];
            console.log('deleted ' + key);
        }
    }
    // Convert the JavaScript object back into a JSON string and write it back into file 
    const updatedThemeContent = JSON.stringify(themeObject, null, 2);
    fs.writeFileSync(themePath, updatedThemeContent, 'utf8');
}
function update() {
    deleteTempIconDefinitions();
    dynamicLoadTickChange();
}
exports.update = update;
//# sourceMappingURL=dynamic_icons.js.map