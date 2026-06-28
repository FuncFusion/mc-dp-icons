import type { ThemeContributions, ThemeModule } from "../plugin"
import { findManifestInWorkspace } from "./helpers/findManifest"
import { getTickFileNames } from "./getTickFileNames"
import { getSubFolderFiles } from "./getSubFolderFiles"
import { safeCollect } from "../utils"

async function collect(): Promise<ThemeContributions> {
  const [
    tickFileNames,
    subFolderFiles,
  ] = await Promise.all([
    safeCollect(getTickFileNames, "getTickFileNames", {}),
    safeCollect(getSubFolderFiles, "getSubFolderFiles", {}),
  ])

  const fileNames: Record<string, string> = {}
  Object.assign(fileNames, tickFileNames)
  Object.assign(fileNames, subFolderFiles)

  return { fileNames }
}

export const bedrock: ThemeModule = {
  name: "bedrock",
  async guard() {
    const manifestFiles = await findManifestInWorkspace()
    return manifestFiles.length > 0
  },
  collect,
}
