import { getConfig } from "../../configuration/configManager"
import { warnAboutTooManyFiles } from "../../prompts/tooManyFilesPrompt"
import { subfolderIconMap } from "./constants"
import { subfolderReference } from "./helpers/subfolderReference"

export async function getSubFolderFiles(): Promise<Record<string, string>> {
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
