import * as vscode from "vscode"
import { config } from "../../configuration/configManager"
import { getReferencesFromFunctionTags, processList } from "../utils"

async function getDynamicFunctionNames(): Promise<Record<string, string>> {
  const loadNames = await getReferencesFromFunctionTags("minecraft", "load")
  const tickNames = await getReferencesFromFunctionTags("minecraft", "tick")

  const fileNames: Record<string, string> = {}
  for (const name of loadNames) {
    fileNames[name] = "mcfunction_load_file"
  }
  for (const name of tickNames) {
    fileNames[name] = "mcfunction_tick_file"
  }
  return fileNames
}

async function getCustomFunctionNames(): Promise<Record<string, string>> {
  const customLoadNames: string[] = config.get("loadFunctionNames")
  const customTickNames: string[] = config.get("tickFunctionNames")

  if (!(customLoadNames || customTickNames)) return {}

  const hasCommonName = customLoadNames.some((item: string) =>
    customTickNames.includes(item)
  )

  if (hasCommonName) {
    vscode.window.showWarningMessage(
      "Naming Conflict: Tick and Load functions must be unique"
    )
    return {}
  }

  const loadFunctions = await processList(customLoadNames)
  const tickFunctions = await processList(customTickNames)

  const fileNames: Record<string, string> = {}
  for (const name of loadFunctions) {
    fileNames[name] = "mcfunction_load_file"
  }
  for (const name of tickFunctions) {
    fileNames[name] = "mcfunction_tick_file"
  }
  return fileNames
}

export async function getLoadTickFileNames(): Promise<Record<string, string>> {
  const dynamicMode = config.get("dynamicFunctionIcons")
  if (dynamicMode) return getDynamicFunctionNames()
  return getCustomFunctionNames()
}
