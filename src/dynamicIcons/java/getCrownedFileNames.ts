import { config } from "../../configuration/configManager"
import { processList } from "../utils"

export async function getCrownedFileNames(): Promise<Record<string, string>> {
  const configCrownedFunctions: string[] = config.get("crownedFunctions")
  const configCrownedLoadFunctions: string[] = config.get("crownedLoadFunctions")
  const configCrownedTickFunctions: string[] = config.get("crownedTickFunctions")

  const atLeastOneCrownedFunction = (
    configCrownedFunctions.length ||
    configCrownedTickFunctions.length ||
    configCrownedLoadFunctions.length
  )

  if (!atLeastOneCrownedFunction) return {}

  const fileNames: Record<string, string> = {}

  const crownedFunctions = await processList(configCrownedFunctions)
  crownedFunctions.forEach((name: string) => {
    fileNames[name] = "mcfunction_file_crowned"
  })

  const crownedLoadFunctions = await processList(configCrownedLoadFunctions)
  crownedLoadFunctions.forEach((name: string) => {
    fileNames[name] = "mcfunction_load_file_crowned"
  })

  const crownedTickFunctions = await processList(configCrownedTickFunctions)
  crownedTickFunctions.forEach((name: string) => {
    fileNames[name] = "mcfunction_tick_file_crowned"
  })

  return fileNames
}
