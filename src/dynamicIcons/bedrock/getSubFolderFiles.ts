import { config } from "../../configuration/configManager"
import { warnAboutTooManyFiles } from "../utils"
import { subfolderIconMap } from "./constants"
import { subfolderReference } from "./helpers/subfolderReference"

export async function getSubFolderFiles(): Promise<Record<string, string>> {
  const subfolderIconEnabled = config.get("subfolderIcons")
  if (!subfolderIconEnabled) return {}

  const subfolderResult = await subfolderReference()
  const subfolders = subfolderResult.subfolders
  const totalFiles = subfolderResult.totalFiles
  if (totalFiles >= 2000) warnAboutTooManyFiles()

  const fileNames: Record<string, string> = {}
  const entries = Object.entries(subfolders)
  for (let i = 0; i < entries.length; i++) {
    const key = entries[i][0]
    const filesArray = entries[i][1]
    const icon = subfolderIconMap[key]
    for (let j = 0; j < filesArray.length; j++) {
      const fileName = filesArray[j]
      fileNames[fileName] = icon
    }
  }

  return fileNames
}
