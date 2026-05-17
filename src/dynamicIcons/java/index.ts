import type { ThemeContributions, ThemeModule } from "../plugin"
import { findPackMcmeta } from "../utils"
import { getCrownedFileNames } from "./getCrownedFileNames"
import { getLoadTickFileNames } from "./getLoadTickFileNames"
import { getNamespaceFolders } from "./getNamespaceFolders"
import { getOverlayFolders } from "./getOverlayFolders"
import { getSubFolderFiles } from "./getSubFolderFiles"

async function collect(): Promise<ThemeContributions> {
  const crownedPromise = getCrownedFileNames()
  const loadTickPromise = getLoadTickFileNames()
  const namespaceFoldersPromise = getNamespaceFolders()
  const overlayFoldersPromise = getOverlayFolders()
  const subFolderFilesPromise = getSubFolderFiles()

  const collectorResults = await Promise.all([
    crownedPromise,
    loadTickPromise,
    namespaceFoldersPromise,
    overlayFoldersPromise,
    subFolderFilesPromise,
  ])

  const crowned = collectorResults[0]
  const loadTick = collectorResults[1]
  const namespaceFolders = collectorResults[2]
  const overlayFolders = collectorResults[3]
  const subFolderFiles = collectorResults[4]

  const fileNames: Record<string, string> = {}
  Object.assign(fileNames, loadTick)
  Object.assign(fileNames, crowned)
  Object.assign(fileNames, subFolderFiles)

  const folderNames: Record<string, string> = {}
  Object.assign(folderNames, namespaceFolders)
  Object.assign(folderNames, overlayFolders)

  return {
    fileNames,
    folderNames: Object.keys(folderNames).length > 0 ? folderNames : undefined,
  }
}

export const java: ThemeModule = {
  name: "java",
  async guard() {
    const mcmetaFiles = await findPackMcmeta()
    return mcmetaFiles.length > 0
  },
  collect,
}
