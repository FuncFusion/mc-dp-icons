/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/theme_change.ts":
/*!*****************************!*\
  !*** ./src/theme_change.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkPackMcmeta = exports.getDefaultIconTheme = void 0;
const vscode = __importStar(__webpack_require__(/*! vscode */ "vscode"));
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
let defaultIconTheme;
let currentIconTheme;
function getDefaultIconTheme() {
    let configIconTheme = vscode_1.workspace.getConfiguration().get('mc-dp-icons.setDefaultIconTheme');
    if (configIconTheme === "") {
        let currentIconTheme = vscode.workspace.getConfiguration('workbench').get('iconTheme');
        if (currentIconTheme !== "mc-dp-icons") {
            defaultIconTheme = currentIconTheme;
        }
    }
    else {
        defaultIconTheme = configIconTheme;
    }
}
exports.getDefaultIconTheme = getDefaultIconTheme;
// Updates the icon theme theme based on the existence of pack.mcmeta in the workspace
function checkPackMcmeta() {
    const enableCheck = vscode_1.workspace.getConfiguration().get('mc-dp-icons.enablePackMcmetaCheck');
    if (enableCheck) {
        vscode.workspace
            .findFiles('**/pack.mcmeta', '**/node_modules/**')
            .then((files) => {
            const packMcmetaExists = files.length > 0;
            if (packMcmetaExists) {
                vscode.workspace.getConfiguration('workbench')
                    .update('iconTheme', 'mc-dp-icons', vscode.ConfigurationTarget.Workspace);
            }
            else if (vscode.workspace.getConfiguration('workbench').get('iconTheme') === "mc-dp-icons") {
                vscode.workspace.getConfiguration('workbench')
                    .update('iconTheme', defaultIconTheme, vscode.ConfigurationTarget.Workspace);
            }
        });
    }
}
exports.checkPackMcmeta = checkPackMcmeta;


/***/ }),

/***/ "./src/web_extension.ts":
/*!******************************!*\
  !*** ./src/web_extension.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = void 0;
const vscode = __importStar(__webpack_require__(/*! vscode */ "vscode"));
const ThemeChange = __importStar(__webpack_require__(/*! ./theme_change */ "./src/theme_change.ts"));
function activate(context) {
    // console.log('Extension "mc-dp-icons" is now active!');
    // Register the event listeners
    context.subscriptions.push(vscode.workspace.onDidChangeWorkspaceFolders(() => { ThemeChange.checkPackMcmeta(); }), vscode.workspace.onDidRenameFiles(() => { ThemeChange.checkPackMcmeta(); }), vscode.workspace.onDidDeleteFiles(() => { ThemeChange.checkPackMcmeta(); }), vscode.workspace.onDidCreateFiles(() => { ThemeChange.checkPackMcmeta(); }), vscode.workspace.onDidChangeConfiguration(() => { ThemeChange.getDefaultIconTheme(); }));
    // Calling these functions on startup
    ThemeChange.getDefaultIconTheme();
    ThemeChange.checkPackMcmeta();
    let DpIconsOpenSettings = vscode.commands.registerCommand('mc-dp-icons.DpIconsOpenSettings', () => {
        vscode.commands.executeCommand('workbench.action.openSettings', '@ext:superant.mc-dp-icons');
    });
    context.subscriptions.push(DpIconsOpenSettings);
}
exports.activate = activate;


/***/ }),

/***/ "vscode":
/*!*************************!*\
  !*** external "vscode" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("vscode");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/web_extension.ts");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=web_extension.js.map