import * as vscode from "vscode"
import { getConfig } from "../../configuration/configManager"
import { filterSegmentDepth, getReferencesFromFunctionTags, processList } from "../utils"

async function getTaggedTick(): Promise<Record<string, string>> {
  const tickNames = await getReferencesFromFunctionTags("minecraft", "tick")

  const fileNames: Record<string, string> = {}
  for (const name of tickNames) {
    fileNames[name] = "mcfunction_tick_file"
  }
  return fileNames
}

async function getCustomTick(): Promise<Record<string, string>> {
  const customTickNames = getConfig("tickFunctionNames")
  if (!customTickNames) {
    return {}
  }

  const tickFunctions = await processList(customTickNames)

  const { valid, invalid } = filterSegmentDepth(tickFunctions)
  if (invalid.length > 0) {
    vscode.window.showErrorMessage(
      "Ignored " + invalid.length + " icon path(s) with more than 2 segments. " +
      "VS Code icon themes only support up to 2 path segments."
    )
  }

  const fileNames: Record<string, string> = {}
  for (const name of valid) {
    fileNames[name] = "mcfunction_tick_file"
  }
  return fileNames
}

export async function getTickFileNames(): Promise<Record<string, string>> {
  let dynamicResult: Record<string, string> = {}

  if (getConfig("dynamicFunctionIcons")) {
    dynamicResult = await getTaggedTick()
  }

  const customResult = await getCustomTick()

  const fileNames: Record<string, string> = {}

  for (const key of Object.keys(dynamicResult)) {
    const basename = key.includes("/") ? key.split("/").pop() || key : key
    if (!(basename in customResult)) {
      fileNames[key] = dynamicResult[key]
    }
  }

  Object.assign(fileNames, customResult)
  return fileNames
}
