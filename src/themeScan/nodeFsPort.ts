import { readFile, readdir, stat } from "fs/promises"
import { basename, dirname, join, sep } from "path"
import type { DirEntry, FileSystemPort } from "./fsPort"

const IGNORED_DIRS = new Set(["node_modules", ".git", "dist", "out", ".vscode"])

export function createNodeFsPort(roots: string[]): FileSystemPort {
  return {
    roots,
    pathExists,
    readDirectory,
    readTextFile: (path) => readFile(path, "utf8"),
    findFiles: (pattern) => findFilesInRoots(roots, pattern),
  }
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath)
    return true
  } catch {
    return false
  }
}

async function readDirectory(dirPath: string): Promise<DirEntry[]> {
  const entries = await readdir(dirPath, { withFileTypes: true })
  return entries.map((e) => ({
    name: e.name,
    isDirectory: e.isDirectory(),
  }))
}

async function findFilesInRoots(roots: string[], pattern: string): Promise<string[]> {
  const matcher = globToMatcher(pattern)
  const results: string[] = []

  for (const root of roots) {
    await walk(root, async (filePath) => {
      const rel = filePath.slice(root.length + 1).split(sep).join("/")
      if (matcher(rel)) {
        results.push(filePath)
      }
    })
  }

  return results
}

function globToMatcher(pattern: string): (relativePath: string) => boolean {
  if (pattern.startsWith("**/")) {
    const suffix = pattern.slice(3)
    return (rel) => rel === suffix || rel.endsWith("/" + suffix)
  }
  return (rel) => rel === pattern || rel.endsWith("/" + pattern)
}

async function walk(root: string, onFile: (filePath: string) => Promise<void>): Promise<void> {
  async function visit(dir: string): Promise<void> {
    let entries
    try {
      entries = await readdir(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      if (entry.name.startsWith(".") && entry.name !== ".") {
        continue
      }
      if (IGNORED_DIRS.has(entry.name)) {
        continue
      }
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        await visit(fullPath)
      } else {
        await onFile(fullPath)
      }
    }
  }
  await visit(root)
}

export async function findPackMcmetaDirs(fs: FileSystemPort): Promise<string[]> {
  const files = await fs.findFiles("**/pack.mcmeta")
  return files.map((f) => dirname(f))
}

export async function findBedrockPackRoots(fs: FileSystemPort): Promise<string[]> {
  const files = await fs.findFiles("**/manifest.json")
  return files.map((f) => dirname(f))
}

export { walk, pathExists as nodePathExists }
