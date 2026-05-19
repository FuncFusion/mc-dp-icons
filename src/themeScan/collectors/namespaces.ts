import { join } from "path"
import type { FileSystemPort } from "../fsPort"

export async function collectNamespaceFolders(
  packPaths: string[],
  fs: FileSystemPort
): Promise<Record<string, string>> {
  const folderNames: Record<string, string> = {}

  for (const packPath of packPaths) {
    for (const segment of ["data", "assets"]) {
      const dir = join(packPath, segment)
      if (!(await fs.pathExists(dir))) {
        continue
      }
      const entries = await fs.readDirectory(dir)
      for (const entry of entries) {
        if (entry.isDirectory && !entry.name.startsWith(".")) {
          folderNames[`${segment}/${entry.name}`] = "namespace_folder"
        }
      }
    }
  }

  return folderNames
}
