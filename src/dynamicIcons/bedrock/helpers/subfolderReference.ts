import * as vscode from "vscode"
import { workspace } from "vscode"
import { Utils } from "vscode-uri"
import { getFilesInDirectory } from "../../utils"
import { getRootPaths } from "./getRootPaths"
import { subfolderIconMap } from "../constants"

const fs = workspace.fs

export async function subfolderReference(): Promise<{ subfolders: Record<string, string[]>, totalFiles: number }> {
  const subfolders: Record<string, string[]> = {}
  const rootPaths = await getRootPaths()
  let totalFiles = 0

  for (const rootPath of rootPaths) {
    const rootUri = vscode.Uri.file(rootPath)
    const entries = await fs.readDirectory(rootUri)

    for (const entry of entries) {
      const entryName = entry[0]
      const entryType = entry[1]
      const properDirectory =
        entryType === vscode.FileType.Directory && entryName in subfolderIconMap

      if (properDirectory) {
        const subfolderPath = Utils.joinPath(vscode.Uri.file(rootPath), entryName).fsPath
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
