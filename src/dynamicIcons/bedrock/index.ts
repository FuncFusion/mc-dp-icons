import type { ThemeContributions, ThemeModule } from "../plugin"
import { findManifestInWorkspace } from "./helpers/findManifest"
import { getTickFileNames } from "./getTickFileNames"
import { getSubFolderFiles } from "./getSubFolderFiles"

async function collect(): Promise<ThemeContributions> {
  const tickFileNamesPromise = getTickFileNames()
  const subFolderFilesPromise = getSubFolderFiles()

  const collectorResults = await Promise.all([
    tickFileNamesPromise,
    subFolderFilesPromise,
  ])

  const tickFileNames = collectorResults[0]
  const subFolderFiles = collectorResults[1]

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
