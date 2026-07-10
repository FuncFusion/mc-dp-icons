import * as vscode from "vscode"
import { workspace } from "vscode"
import { Utils } from "vscode-uri"
import { getFilesInDirectory, pathExists } from "../../utils"
import { getNamespacePaths } from "./getNamespacePaths"
import { subfolderIconMap } from "../../constants"

const fs = workspace.fs

export async function subfolderReference(mcmetaFiles: vscode.Uri[]): Promise<{ subfolders: Record<string, string[]>, totalFiles: number }> {
  const subfolders: Record<string, string[]> = {}
  const namespacePaths = await getNamespacePaths(mcmetaFiles)
  let totalFiles = 0

  for (const namespacePath of namespacePaths) {
    if (!await pathExists(namespacePath)) {
      continue
    }

    const entries = await fs.readDirectory(vscode.Uri.file(namespacePath))

    for (const entry of entries) {
      const entryName = entry[0]
      const entryType = entry[1]
      const properDirectory =
        entryType === vscode.FileType.Directory && entryName in subfolderIconMap

      if (properDirectory) {
        const subfolderPath = Utils.joinPath(vscode.Uri.file(namespacePath), entryName).fsPath
        const files = await getFilesInDirectory(subfolderPath)
        totalFiles += files.length

        if (subfolders[entryName]) {
          subfolders[entryName].push(...files)
        } else {
          subfolders[entryName] = files
        }
      }
    }
  }

  return { subfolders, totalFiles }
}
