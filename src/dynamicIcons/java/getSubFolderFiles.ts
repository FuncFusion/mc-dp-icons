import * as vscode from "vscode"
import { subfolderReference } from "./helpers/subfolderReference"
import { getSubFolderFiles as collect } from "../utils"

export const getSubFolderFiles = (mcmetaFiles: vscode.Uri[]): Promise<Record<string, string>> => collect(() => subfolderReference(mcmetaFiles))
