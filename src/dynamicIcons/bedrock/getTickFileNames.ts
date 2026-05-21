import { getConfig } from "../../configuration/configManager"
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
  const customTickNames = getConfig("tickFunctionNames")
  if (!customTickNames) {
    return {}
  }

  const tickFunctions = await processList(customTickNames)

  const fileNames: Record<string, string> = {}
  for (const name of tickFunctions) {
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
