import * as vscode from "vscode"
import { workspace } from "vscode"
import { Utils } from 'vscode-uri'
import path from "path"
import { config } from "../configuration/configManager"

const fs = workspace.fs

export async function getFilesInDirectory(directory: string): Promise<string[]> {
  const files: string[] = []
  const excludedFiles = [
    "function/load.json",
    "function/tick.json",
    "functions/load.json",
    "functions/tick.json",
  ]
  const collectFiles = async (dir: string, relativePath = "") => {
    const dirUri = vscode.Uri.file(dir)
    const entries = await fs.readDirectory(dirUri)
    for (const entry of entries) {
      const entryName = entry[0]
      const entryType = entry[1]
      if (entryName.startsWith('.') || entryName == 'node_modules') continue

      const fullPath = Utils.joinPath(vscode.Uri.file(dir), entryName).fsPath
      const newPath = Utils.joinPath(vscode.Uri.file(relativePath), entryName).fsPath
      const pathDepth = newPath.split(path.sep).length

      const validSubfolderFile =
        pathDepth > 2 &&
        newPath.endsWith(".json") &&
        !excludedFiles.some((file) => newPath.includes(file))
      const fileInSubfolder = validSubfolderFile

      if (entryType === vscode.FileType.Directory) {
        await collectFiles(fullPath, newPath)
      } else if (fileInSubfolder) {
        const shortenedPath =
          pathDepth > 2
            ? newPath.split(path.sep).slice(-2).join('/')
            : newPath

        files.push(shortenedPath)
      }
    }
  }
  await collectFiles(directory)
  return files
}

export function warnAboutTooManyFiles() {
  const warningMessage = `Too many files in subsubfolders (Over 2000). Subfolder icons feature might not work properly. Would you like to disable this feature?`

  vscode.window
    .showWarningMessage(
      warningMessage,
      { modal: false },
      "Disable Globally",
      "Disable in Workspace",
    )
    .then((selection) => {
      if (selection === "Disable Globally") {
        config.changeGlobal("mc-dp-icons.subfolderIcons", false)
      } else if (selection === "Disable in Workspace") {
        config.changeWorkspace("mc-dp-icons.subfolderIcons", false)
      }
    })
}

export async function getReferencesFromFunctionTags(namespace: string, functionTag: string): Promise<string[]> {
  const functionTagFiles = await vscode.workspace.findFiles(
    `**/${namespace}/tags/function/**/${functionTag}.json`,
    "**/node_modules/**",
  )

  if (!functionTagFiles.length) return []

  let functionReferences: string[] = []

  for (const functionTagFile of functionTagFiles) {
    const data = await fs.readFile(functionTagFile)
    const content = new TextDecoder().decode(data)
    const functionTag: { values: string[] } = JSON.parse(content)

    if (!functionTag.values.length) continue

    for (const functionID of functionTag.values) {
      const functionPath: string = "function/" + functionID.split(":")[1]
      const shortenedPath = functionPath.split('/').slice(-2).join('/')
      functionReferences.push(`${shortenedPath}.mcfunction`)
    }
  }

  return functionReferences
}

export async function getPartialMatches(customNames: string[]): Promise<string[]> {
  const matchedFunctions = (await Promise.all(
    customNames.map((name) => vscode.workspace.findFiles(`**/${name}.mcfunction`))
  )).flat()

  const fileNames: string[] = matchedFunctions.map((matchedFunction: vscode.Uri) => {
    return path.basename(matchedFunction.fsPath)
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
  return array.some(item => item.includes("*"))
}

export async function processList(list: string[]): Promise<string[]> {
  if (usesPartialMatch(list)) {
    return await getPartialMatches(list)
  }
  return list.map(item => item + ".mcfunction")
}
