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
const LocalIcons = __importStar(require("./theme_change"));
const DynamicIcons = __importStar(require("./dynamic_icons"));
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    console.log('Extension "mc-dp-icons" is now active!');
    // Register the event listeners
    context.subscriptions.push(vscode.workspace.onDidChangeWorkspaceFolders(() => { DynamicIcons.update(); LocalIcons.checkPackMcmeta(); }), vscode.workspace.onDidRenameFiles(() => { DynamicIcons.update(); LocalIcons.checkPackMcmeta(); }), vscode.workspace.onDidDeleteFiles(() => { DynamicIcons.update(); LocalIcons.checkPackMcmeta(); }), vscode.workspace.onDidCreateFiles(() => { DynamicIcons.update(); LocalIcons.checkPackMcmeta(); }), vscode.workspace.onDidChangeTextDocument(DynamicIcons.update));
    context.subscriptions.push(vscode.workspace.onDidChangeWorkspaceFolders(() => { DynamicIcons.update(); LocalIcons.checkPackMcmeta(); }), vscode.workspace.onDidRenameFiles(() => { DynamicIcons.update(); LocalIcons.checkPackMcmeta(); }), vscode.workspace.onDidDeleteFiles(() => { DynamicIcons.update(); LocalIcons.checkPackMcmeta(); }), vscode.workspace.onDidCreateFiles(() => { DynamicIcons.update(); LocalIcons.checkPackMcmeta(); }), vscode.workspace.onDidChangeTextDocument(DynamicIcons.update));
    // Get the default icon theme on configuration change
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(LocalIcons.getDefaltIconTheme));
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(LocalIcons.getDefaltIconTheme));
    // Get default Icon theme on startup
    LocalIcons.getDefaltIconTheme();
    LocalIcons.getDefaltIconTheme();
    // Check for pack.mcmeta on startup
    LocalIcons.checkPackMcmeta();
    LocalIcons.checkPackMcmeta();
    // Change load and tick mcfunction icons
    DynamicIcons.update();
    DynamicIcons.update();
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('mc-dp-icons.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        LocalIcons.checkPackMcmeta();
        LocalIcons.checkPackMcmeta();
        vscode.window.showInformationMessage('Hello World from Datapack Icons!');
    });
    // let dynamicLoadTickChangeCommand = vscode.commands.registerCommand('mc-dp-icons.dynamicLoadTickChange', () => {
    // 	dynamicLoadTickChange();
    // 	vscode.window.showInformationMessage('Change tick and load functions icons');
    // });
    context.subscriptions.push(disposable);
    // context.subscriptions.push(dynamicLoadTickChangeCommand);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map