import * as vscode from "vscode"
import { workspace } from "vscode"
import { Utils } from "vscode-uri"
import { findPackMcmeta, pathExists } from "../../utils"
import { logger } from "../../../common/logger"

const fs = workspace.fs

export async function getNamespacePaths(): Promise<string[]> {
  const mcmetaFiles = await findPackMcmeta()
  const packPaths = mcmetaFiles.map(p => p.fsPath.replace("pack.mcmeta", ""))

  if (!packPaths) return []

  const namespacePaths: string[] = []

  const getPaths = async (directory: string): Promise<string[]> => {
    if (!await pathExists(directory)) return []
    const entries = await fs.readDirectory(vscode.Uri.file(directory))

    return entries
      .filter((entry: [string, vscode.FileType]) => entry[1] === vscode.FileType.Directory)
      .map(entry => Utils.joinPath(vscode.Uri.file(directory), entry[0]).fsPath)
  }

  for (const packPath of packPaths) {
    try {
      const assetsPath = Utils.joinPath(vscode.Uri.file(packPath), "assets").fsPath
      const assetsPaths = await getPaths(assetsPath)
      namespacePaths.push(...assetsPaths)

      const dataPath = Utils.joinPath(vscode.Uri.file(packPath), "data").fsPath
      const dataPaths = await getPaths(dataPath)
      namespacePaths.push(...dataPaths)
    } catch (error) {
      logger.error(error, `reading folder: ${packPath}data`)
    }
  }

  return namespacePaths
}
