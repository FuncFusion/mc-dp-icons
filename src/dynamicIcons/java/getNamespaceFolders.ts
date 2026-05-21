import path from "path"
import { getConfig } from "../../configuration/configManager"
import { getNamespacePaths } from "./helpers/getNamespacePaths"

export async function getNamespaceFolders(): Promise<Record<string, string>> {
  const namespaceIcons = getConfig("namespaceIcons")
  if (!namespaceIcons) {
    return {}
  }

  const namespacePaths = await getNamespacePaths() || []

  const namespaceNames = namespacePaths.map((fullPath) => {
    const pathSegments = fullPath.split(path.sep)
    return pathSegments.slice(-2).join('/')
  })

  const folderNames: Record<string, string> = {}
  namespaceNames.forEach((namespace) => {
    folderNames[namespace] = "namespace_folder"
  })

  return folderNames
}
