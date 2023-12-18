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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPackMcmeta = exports.getDefaultIconTheme = void 0;
const vscode = __importStar(require("vscode"));
const vscode_1 = require("vscode");
let defaultIconTheme;
function getDefaultIconTheme() {
    let confDefaultIconTheme = vscode_1.workspace.getConfiguration().get('mc-dp-icons.setDefaultIconTheme');
    if (confDefaultIconTheme === "") {
        let gettingDefaultIconTheme = vscode.workspace.getConfiguration('workbench').get('iconTheme');
        if (gettingDefaultIconTheme !== "mc-dp-icons") {
            defaultIconTheme = gettingDefaultIconTheme;
        }
    }
    else {
        defaultIconTheme = confDefaultIconTheme;
    }
    vscode.window.showInformationMessage('default icon theme is ' + defaultIconTheme);
}
exports.getDefaultIconTheme = getDefaultIconTheme;
function checkPackMcmeta() {
    const enableCheck = vscode_1.workspace.getConfiguration().get('mc-dp-icons.enablePackMcmetaCheck');
    if (enableCheck) {
        // Find the pack.mcmeta file in the workspace
        vscode.workspace
            .findFiles('**/pack.mcmeta', '**/node_modules/**')
            .then((files) => {
            if (files.length > 0) {
                console.log('pack.mcmeta is found');
                // Set the icon theme to the Datapack Icons theme
                vscode.workspace.getConfiguration('workbench')
                    .update('iconTheme', 'mc-dp-icons', vscode.ConfigurationTarget.Workspace);
            }
            else {
                console.log('pack.mcmeta is not found');
                // Reset the icon theme to the default one
                if (defaultIconTheme) {
                    vscode.workspace.getConfiguration('workbench')
                        .update('iconTheme', defaultIconTheme, vscode.ConfigurationTarget.Workspace);
                }
            }
        });
    }
}
exports.checkPackMcmeta = checkPackMcmeta;
//# sourceMappingURL=theme_change.js.map