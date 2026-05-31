import { getConfig } from "../../configuration/configManager"
import { getReferencesFromFunctionTags } from "../utils"

export async function getTagFileNames(): Promise<Record<string, string>> {
  if (!getConfig("dynamicFunctionIcons")) {
    return {}
  }

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
