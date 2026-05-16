import * as vscode from "vscode"
import { workspace } from "vscode"
import { Utils } from "vscode-uri"

const fs = workspace.fs

async function findManifestInDirectory(directory: string): Promise<string[]> {
  const dirUri = vscode.Uri.file(directory)
  const entries = await fs.readDirectory(dirUri)
  let manifestPaths: string[] = []

  for (const entry of entries) {
    const entryName = entry[0]
    const entryType = entry[1]
    const filePath = Utils.joinPath(vscode.Uri.file(directory), entryName).fsPath

    if (entryType === vscode.FileType.Directory) {
      manifestPaths = manifestPaths.concat(await findManifestInDirectory(filePath))
    } else if (entryName === "manifest.json") {
      manifestPaths.push(filePath)
    }
  }

  return manifestPaths
}

export async function findManifestInWorkspace(): Promise<string[]> {
  let manifestPaths: string[] = []
  const directories = workspace.workspaceFolders?.map((folder) => folder.uri.fsPath) || []

  for (const directory of directories) {
    manifestPaths = manifestPaths.concat(await findManifestInDirectory(directory))
  }

  return manifestPaths
}
