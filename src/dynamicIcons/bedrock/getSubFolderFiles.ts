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
  for (const [key, filesArray] of Object.entries(subfolders)) {
    const icon = subfolderIconMap[key]
    for (const fileName of filesArray) {
      fileNames[fileName] = icon
    }
  }

  return fileNames
}
