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
exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const ThemeChange = __importStar(require("./theme_change"));
const DynamicIcons = __importStar(require("./dynamic_icons/main"));
const path = __importStar(require("path"));
function activate(context) {
    // Register listeners
    const runUpdates = () => {
        DynamicIcons.update();
        ThemeChange.checkPackMcmeta();
    };
    const handleFileChange = (fileName) => {
        if (fileName.endsWith(".mcmeta") || fileName.endsWith(".json")) {
            runUpdates();
        }
    };
    context.subscriptions.push(vscode.workspace.onDidChangeWorkspaceFolders(() => {
        runUpdates();
    }), vscode.workspace.onDidRenameFiles((event) => {
        handleFileChange(path.basename(event.files[0].newUri.fsPath));
        handleFileChange(path.basename(event.files[0].oldUri.fsPath));
    }), vscode.workspace.onDidDeleteFiles((event) => {
        handleFileChange(path.basename(event.files[0].fsPath));
    }), vscode.workspace.onDidCreateFiles((event) => {
        handleFileChange(path.basename(event.files[0].fsPath));
    }), vscode.workspace.onDidSaveTextDocument((document) => {
        handleFileChange(path.basename(document.fileName));
    }), vscode.workspace.onDidChangeConfiguration(() => {
        runUpdates();
    }));
    // Calling these functions on startup
    ThemeChange.getDefaultIconTheme();
    ThemeChange.checkPackMcmeta();
    DynamicIcons.update();
    let DpIconsOpenSettings = vscode.commands.registerCommand("mc-dp-icons.DpIconsOpenSettings", () => {
        vscode.commands.executeCommand("workbench.action.openSettings", "@ext:superant.mc-dp-icons");
    });
    context.subscriptions.push(DpIconsOpenSettings);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map