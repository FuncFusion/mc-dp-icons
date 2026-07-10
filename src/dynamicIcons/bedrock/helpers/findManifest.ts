import * as vscode from "vscode"
import { workspace } from "vscode"
import { Utils } from "vscode-uri"

const fs = workspace.fs

async function findManifestInDirectory(directory: string, depth = 0): Promise<string[]> {
  if (depth >= 10) {
    return []
  }

  const dirUri = vscode.Uri.file(directory)
  const entries = await fs.readDirectory(dirUri)
  let manifestPaths: string[] = []

  for (const entry of entries) {
    const entryName = entry[0]
    const entryType = entry[1]
    const filePath = Utils.joinPath(vscode.Uri.file(directory), entryName).fsPath

    if (entryName === 'node_modules' || entryName.startsWith('.')) {
      continue
    }

    if (entryType === vscode.FileType.Directory) {
      manifestPaths = manifestPaths.concat(await findManifestInDirectory(filePath, depth + 1))
    } else if (entryName === "manifest.json") {
      try {
        const content = await fs.readFile(vscode.Uri.file(filePath))
        const json = JSON.parse(new TextDecoder().decode(content))
        if (!("format_version" in json)) {
          continue
        }
      } catch {
        continue
      }
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
