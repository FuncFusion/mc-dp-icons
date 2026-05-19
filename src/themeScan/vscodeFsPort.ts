import * as vscode from "vscode"
import { workspace } from "vscode"
import type { DirEntry, FileSystemPort } from "./fsPort"

const fs = workspace.fs

export function createVscodeFsPort(): FileSystemPort {
  const roots = workspace.workspaceFolders?.map((f) => f.uri.fsPath) ?? []
  return {
    roots,
    pathExists: async (filePath) => {
      try {
        await fs.stat(vscode.Uri.file(filePath))
        return true
      } catch {
        return false
      }
    },
    readDirectory: async (dirPath) => {
      const entries = await fs.readDirectory(vscode.Uri.file(dirPath))
      return entries.map(([name, type]) => ({
        name,
        isDirectory: type === vscode.FileType.Directory,
      }))
    },
    readTextFile: async (filePath) => {
      const data = await fs.readFile(vscode.Uri.file(filePath))
      return new TextDecoder().decode(data)
    },
    findFiles: async (relativePattern) => {
      const uris = await workspace.findFiles(relativePattern, "**/node_modules/**")
      return uris.map((u) => u.fsPath)
    },
  }
}

export type { DirEntry }
