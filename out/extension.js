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
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const vscode_1 = require("vscode");
let defaultIconTheme;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    console.log('Extension "mc-dp-icons" is now active!');
    // Register the event listeners
    context.subscriptions.push(vscode.workspace.onDidChangeWorkspaceFolders(checkPackMcmeta), vscode.workspace.onDidRenameFiles(checkPackMcmeta), vscode.workspace.onDidDeleteFiles(checkPackMcmeta), vscode.workspace.onDidCreateFiles(checkPackMcmeta));
    // Get the default icon theme
    defaultIconTheme = vscode.workspace.getConfiguration('workbench').get('iconTheme');
    console.log(defaultIconTheme);
    // Check for pack.mcmeta on startup
    checkPackMcmeta();
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('mc-dp-icons.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from Datapack Icons!');
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function checkPackMcmeta() {
    const enableCheck = vscode_1.workspace.getConfiguration().get('mc-dp-icons.enablePackMcmetaCheck');
    if (enableCheck) {
        // Find the pack.mcmeta file in the workspace
        vscode.workspace
            .findFiles('**/pack.mcmeta', '**/node_modules/**')
            .then((files) => {
            if (files.length > 0) {
                vscode.window.showInformationMessage('pack.mcmeta is detected');
                console.log('Yes mcmeta');
                // Set the icon theme to the Datapack Icons theme
                vscode.workspace
                    .getConfiguration('workbench')
                    .update('iconTheme', 'mc-dp-icons', vscode.ConfigurationTarget.Workspace);
            }
            else {
                vscode.window.showInformationMessage('pack.mcmeta is not found');
                console.log('No mcmeta');
                // Reset the icon theme to the default one
                if (defaultIconTheme) {
                    vscode.workspace
                        .getConfiguration('workbench')
                        .update('iconTheme', defaultIconTheme, vscode.ConfigurationTarget.Workspace);
                    console.log('changing to default, which is ' + defaultIconTheme);
                    console.log('now its ' + vscode.workspace.getConfiguration('workbench').get('iconTheme'));
                }
            }
        });
    }
}
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map