import * as vscode from "vscode"
import { workspace } from "vscode"
import { Utils } from "vscode-uri"
import { findPackMcmeta, pathExists } from "../../utils"

const fs = workspace.fs

export async function getOverlayPaths(): Promise<string[]> {
  const mcmetaFiles = await findPackMcmeta()
  const packPaths = mcmetaFiles.map(p => p.fsPath.replace("pack.mcmeta", ""))
  const validOverlayPaths: string[] = []

  for (const packPath of packPaths) {
    if (!await pathExists(packPath)) continue

    const itemsWithinPack = await fs.readDirectory(vscode.Uri.file(packPath))

    for (const item of itemsWithinPack) {
      const entryName = item[0]
      const entryType = item[1]

      if (entryType === vscode.FileType.Directory) {
        const subDirPath = Utils.joinPath(vscode.Uri.file(packPath), entryName).fsPath

        const hasData = await pathExists(Utils.joinPath(vscode.Uri.file(subDirPath), "data").fsPath)
        const hasAssets = await pathExists(Utils.joinPath(vscode.Uri.file(subDirPath), "assets").fsPath)

        if (hasData !== hasAssets) {
          const pathSegments = subDirPath.split('/')
          const validPath = pathSegments.slice(-2).join('/')
          validOverlayPaths.push(validPath)
        }
      }
    }
  }

  return validOverlayPaths
}
