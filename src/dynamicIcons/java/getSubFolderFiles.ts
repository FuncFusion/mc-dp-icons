import * as vscode from "vscode"
import { subfolderReference } from "./helpers/subfolderReference"
import { getSubFolderFiles as collect } from "../utils"

export async function getSubFolderFiles(mcmetaFiles: vscode.Uri[]): Promise<Record<string, string>> {
  const scan = async () => {
    return subfolderReference(mcmetaFiles)
  }
  return collect(scan)
}
