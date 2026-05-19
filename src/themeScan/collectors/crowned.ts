import { basename } from "path"
import type { FileSystemPort } from "../fsPort"

async function resolveFunctionList(
  fs: FileSystemPort,
  names: string[]
): Promise<string[]> {
  const results: string[] = []
  for (const name of names) {
    if (name.includes("*")) {
      const matches = await fs.findFiles(`**/${name}.mcfunction`)
      results.push(...matches.map((p) => basename(p)))
    } else {
      results.push(name.endsWith(".mcfunction") ? name : `${name}.mcfunction`)
    }
  }
  return results
}

export async function collectCrownedFunctions(
  fs: FileSystemPort,
  options: {
    crownedFunctions: string[]
    crownedLoadFunctions: string[]
    crownedTickFunctions: string[]
  }
): Promise<Record<string, string>> {
  const hasAny =
    options.crownedFunctions.length > 0 ||
    options.crownedLoadFunctions.length > 0 ||
    options.crownedTickFunctions.length > 0

  if (!hasAny) {
    return {}
  }

  const fileNames: Record<string, string> = {}

  for (const name of await resolveFunctionList(fs, options.crownedFunctions)) {
    fileNames[name] = "mcfunction_file_crowned"
  }
  for (const name of await resolveFunctionList(fs, options.crownedLoadFunctions)) {
    fileNames[name] = "mcfunction_load_file_crowned"
  }
  for (const name of await resolveFunctionList(fs, options.crownedTickFunctions)) {
    fileNames[name] = "mcfunction_tick_file_crowned"
  }

  return fileNames
}
