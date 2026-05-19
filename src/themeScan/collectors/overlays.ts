import { join } from "path"
import type { FileSystemPort } from "../fsPort"

export async function collectOverlayFolders(
  packPaths: string[],
  fs: FileSystemPort
): Promise<Record<string, string>> {
  const folderNames: Record<string, string> = {}

  for (const packPath of packPaths) {
    const entries = await fs.readDirectory(packPath)
    for (const entry of entries) {
      if (!entry.isDirectory || entry.name.startsWith(".")) {
        continue
      }
      const subDir = join(packPath, entry.name)
      const hasData = await fs.pathExists(join(subDir, "data"))
      const hasAssets = await fs.pathExists(join(subDir, "assets"))
      if (hasData !== hasAssets) {
        folderNames[entry.name] = "overlay_folder"
      }
    }
  }

  return folderNames
}
