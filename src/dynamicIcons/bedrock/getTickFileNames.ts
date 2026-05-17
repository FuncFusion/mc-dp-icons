import { config } from "../../configuration/configManager"
import { getReferencesFromFunctionTags, processList } from "../utils"

async function getTaggedTick(): Promise<Record<string, string>> {
  const tickNames = await getReferencesFromFunctionTags("minecraft", "tick")

  const fileNames: Record<string, string> = {}
  for (const name of tickNames) {
    fileNames[name] = "mcfunction_tick_file"
  }
  return fileNames
}

async function getCustomTick(): Promise<Record<string, string>> {
  const customTickNames = config.get("tickFunctionNames")
  if (!customTickNames) return {}

  const tickFunctions = await processList(customTickNames)

  const fileNames: Record<string, string> = {}
  for (const name of tickFunctions) {
    fileNames[name] = "mcfunction_tick_file"
  }
  return fileNames
}

export async function getTickFileNames(): Promise<Record<string, string>> {
  const dynamicMode = config.get("dynamicFunctionIcons")
  if (dynamicMode) return getTaggedTick()
  return getCustomTick()
}
