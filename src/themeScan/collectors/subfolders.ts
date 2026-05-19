import { join } from "path"
import type { FileSystemPort } from "../fsPort"

const EXCLUDED_JSON_PATHS = [
  "function/load.json",
  "function/tick.json",
  "functions/load.json",
  "functions/tick.json",
]

async function collectJsonFilesInTree(
  fs: FileSystemPort,
  dir: string,
  onFile: (relativePath: string) => void,
  relativePath = ""
): Promise<void> {
  const entries = await fs.readDirectory(dir)
  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") {
      continue
    }
    const fullPath = join(dir, entry.name)
    const rel = relativePath ? `${relativePath}/${entry.name}` : entry.name
    if (entry.isDirectory) {
      await collectJsonFilesInTree(fs, fullPath, onFile, rel)
    } else if (
      entry.name.endsWith(".json") &&
      !EXCLUDED_JSON_PATHS.some((ex) => rel.includes(ex))
    ) {
      const depth = rel.split("/").length
      const shortened = depth > 2 ? rel.split("/").slice(-2).join("/") : rel
      onFile(shortened)
    }
  }
}

export async function collectJavaSubfolderFiles(
  packPaths: string[],
  fs: FileSystemPort,
  subfolderIconMap: Record<string, string>
): Promise<{ fileNames: Record<string, string>; totalFiles: number }> {
  const fileNames: Record<string, string> = {}
  let totalFiles = 0

  for (const packPath of packPaths) {
    for (const segment of ["data", "assets"]) {
      const base = join(packPath, segment)
      if (!(await fs.pathExists(base))) {
        continue
      }
      const namespaces = await fs.readDirectory(base)
      for (const ns of namespaces) {
        if (!ns.isDirectory) {
          continue
        }
        const nsPath = join(base, ns.name)
        const categories = await fs.readDirectory(nsPath)
        for (const cat of categories) {
          if (!cat.isDirectory || !(cat.name in subfolderIconMap)) {
            continue
          }
          const icon = subfolderIconMap[cat.name]
          const catPath = join(nsPath, cat.name)
          await collectJsonFilesInTree(fs, catPath, (relativePath) => {
            fileNames[relativePath] = icon
            totalFiles++
          })
        }
      }
    }
  }

  return { fileNames, totalFiles }
}

export async function collectBedrockSubfolderFiles(
  bedrockRoots: string[],
  fs: FileSystemPort,
  subfolderIconMap: Record<string, string>
): Promise<{ fileNames: Record<string, string>; totalFiles: number }> {
  const fileNames: Record<string, string> = {}
  let totalFiles = 0

  for (const rootPath of bedrockRoots) {
    const entries = await fs.readDirectory(rootPath)
    for (const entry of entries) {
      if (!entry.isDirectory || !(entry.name in subfolderIconMap)) {
        continue
      }
      const icon = subfolderIconMap[entry.name]
      const subfolderPath = join(rootPath, entry.name)
      await collectJsonFilesInTree(fs, subfolderPath, (relativePath) => {
        fileNames[relativePath] = icon
        totalFiles++
      })
    }
  }

  return { fileNames, totalFiles }
}
