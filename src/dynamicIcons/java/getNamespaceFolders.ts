import path from "path"
import { config } from "../../configuration/configManager"
import { getNamespacePaths } from "./helpers/getNamespacePaths"

export async function getNamespaceFolders(): Promise<Record<string, string>> {
  const namespaceIcons = config.get("namespaceIcons")
  if (!namespaceIcons) return {}

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
