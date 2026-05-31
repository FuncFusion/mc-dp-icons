import type { ThemeContributions, ThemeModule } from "../plugin"
import { findPackMcmeta } from "../utils"
import { getTagFileNames } from "./getTagFileNames"
import { getUserFileNames } from "./getUserFileNames"
import { getNamespaceFolders } from "./getNamespaceFolders"
import { getOverlayFolders } from "./getOverlayFolders"
import { getSubFolderFiles } from "./getSubFolderFiles"

async function collect(): Promise<ThemeContributions> {
  const [
    tagEntries,
    userEntries,
    namespaceFolders,
    overlayFolders,
    subFolderFiles,
  ] = await Promise.all([
    getTagFileNames(),
    getUserFileNames(),
    getNamespaceFolders(),
    getOverlayFolders(),
    getSubFolderFiles(),
  ])

  const fileNames: Record<string, string> = {}
  Object.assign(fileNames, tagEntries)
  Object.assign(fileNames, userEntries)
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
