import * as vscode from "vscode"
import { workspace } from "vscode"
import { Utils } from 'vscode-uri'
import path from "path"
import { logger } from "../common/logger"
import { getConfig } from "../configuration/configManager"
import { warnAboutTooManyFiles } from "../prompts/tooManyFilesPrompt"
import { subfolderIconMap } from "./constants"

const fs = workspace.fs

export async function getFilesInDirectory(directory: string): Promise<string[]> {
  const files: string[] = []
  const excludedFiles = [
    "function" + path.sep + "load.json",
    "function" + path.sep + "tick.json",
    "functions" + path.sep + "load.json",
    "functions" + path.sep + "tick.json",
  ]
  const collectFiles = async (dir: string, relativePath = "", depth = 0) => {
    if (depth >= 10) {
      return
    }

    const dirUri = vscode.Uri.file(dir)
    const entries = await fs.readDirectory(dirUri)
    for (const entry of entries) {
      const entryName = entry[0]
      const entryType = entry[1]
      if (entryName.startsWith('.') || entryName === 'node_modules') {
        continue
      }

      const fullPath = Utils.joinPath(vscode.Uri.file(dir), entryName).fsPath
      const newPath = Utils.joinPath(vscode.Uri.file(relativePath), entryName).fsPath
      const pathDepth = newPath.split(path.sep).length

      const validSubfolderFile =
        pathDepth > 2 &&
        newPath.endsWith(".json") &&
        !excludedFiles.some((file) => newPath.includes(file))

      if (entryType === vscode.FileType.Directory) {
        await collectFiles(fullPath, newPath, depth + 1)
      } else if (validSubfolderFile) {
        files.push(newPath.split(path.sep).slice(-2).join('/'))
      }
    }
  }
  await collectFiles(directory)
  return files
}

export async function getReferencesFromFunctionTags(namespace: string, functionTag: string): Promise<string[]> {
  const functionTagFiles = await vscode.workspace.findFiles(
    `**/${namespace}/tags/{function,functions}/**/${functionTag}.json`,
    "**/node_modules/**",
  )

  if (!functionTagFiles.length) {
    return []
  }

  let functionReferences: string[] = []

  for (const functionTagFile of functionTagFiles) {
    try {
      const data = await fs.readFile(functionTagFile)
      const content = new TextDecoder().decode(data)
      const tagData = JSON.parse(content) as { values?: unknown[] }

      if (!tagData.values?.length) {
        continue
      }

      const tagDir = functionTagFile.path.includes("tags/functions/")
        ? "functions"
        : "function"

      for (const entry of tagData.values) {
        const functionID = typeof entry === "string" ? entry : (entry && typeof entry === "object" && "id" in entry ? (entry as { id: string }).id : undefined)
        if (!functionID || !functionID.includes(":")) {
          continue
        }
        const functionPath: string = tagDir + "/" + functionID.split(":")[1]
        const shortenedPath = functionPath.split('/').slice(-2).join('/')
        functionReferences.push(`${shortenedPath}.mcfunction`)
      }
    } catch (error) {
      logger.error(error, `skipping bad function tag file: ${functionTagFile.fsPath}`)
      continue
    }
  }

  return functionReferences
}

export async function getPartialMatches(customNames: string[]): Promise<string[]> {
  const matchedFunctions = (await Promise.all(
    customNames.map((name) => vscode.workspace.findFiles(`**/${name}.mcfunction`))
  )).flat()

  const fileNames: string[] = matchedFunctions.map((matchedFunction: vscode.Uri) => {
    const segments = matchedFunction.path.split("/")
    return segments.slice(-2).join("/")
  })

  return fileNames
}

export async function uriExists(uri: vscode.Uri): Promise<boolean> {
  try {
    await fs.stat(uri)
    return true
  } catch {
    return false
  }
}

export async function pathExists(filePath: string): Promise<boolean> {
  return await uriExists(vscode.Uri.file(filePath))
}

export async function findPackMcmeta(): Promise<vscode.Uri[]> {
  return await workspace.findFiles('**/pack.mcmeta', '**/node_modules/**')
}

export function usesPartialMatch(array: string[]): boolean {
  return array.some(item => /[*?[{]/.test(item))
}

export function filterSegmentDepth(names: string[]): { valid: string[], invalid: string[] } {
  const valid: string[] = []
  const invalid: string[] = []
  for (const name of names) {
    if (name.split("/").length > 2) {
      invalid.push(name)
    } else {
      valid.push(name)
    }
  }
  return { valid, invalid }
}

export async function processList(list: string[]): Promise<string[]> {
  if (usesPartialMatch(list)) {
    return await getPartialMatches(list)
  }
  return list.map(item => item.replace(/\\/g, "/") + ".mcfunction")
}

export async function getSubFolderFiles(
  subfolderReference: () => Promise<{ subfolders: Record<string, string[]>, totalFiles: number }>
): Promise<Record<string, string>> {
  const subfolderIconEnabled = getConfig("subfolderIcons")
  if (!subfolderIconEnabled) {
    return {}
  }

  const subfolderResult = await subfolderReference()
  const subfolders = subfolderResult.subfolders
  const totalFiles = subfolderResult.totalFiles
  if (totalFiles >= 10000) {
    warnAboutTooManyFiles()
  }

  const fileNames: Record<string, string> = {}
  for (const [key, filesArray] of Object.entries(subfolders)) {
    const icon = subfolderIconMap[key]
    for (const fileName of filesArray) {
      fileNames[fileName] = icon
    }
  }

  return fileNames
}

export async function safeCollect<T>(fn: () => Promise<T>, name: string, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    logger.error(error, `${name} failed`)
    return fallback
  }
}
