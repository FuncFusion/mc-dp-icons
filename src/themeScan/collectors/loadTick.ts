import { basename } from "path"
import type { FileSystemPort } from "../fsPort"

function stemsFromFunctionId(functionId: string): string[] {
  const fnPath = functionId.includes(":") ? functionId.split(":")[1] : functionId
  const stem = basename(fnPath) + ".mcfunction"
  const shortened =
    fnPath.split("/").length > 1
      ? fnPath.split("/").slice(-2).join("/") + ".mcfunction"
      : stem
  return shortened === stem ? [stem] : [shortened, stem]
}

async function collectFromTagFiles(
  fs: FileSystemPort,
  tag: "load" | "tick",
  icon: string
): Promise<Record<string, string>> {
  const fileNames: Record<string, string> = {}
  const tagFiles = await fs.findFiles(`**/tags/function/${tag}.json`)

  for (const filePath of tagFiles) {
    try {
      const raw = await fs.readTextFile(filePath)
      const parsed = JSON.parse(raw) as { values?: string[] }
      if (!Array.isArray(parsed.values)) {
        continue
      }
      for (const value of parsed.values) {
        for (const stem of stemsFromFunctionId(value)) {
          fileNames[stem] = icon
        }
      }
    } catch {
      // skip invalid json
    }
  }

  return fileNames
}

async function collectFromCustomLists(
  fs: FileSystemPort,
  loadNames: string[],
  tickNames: string[]
): Promise<Record<string, string>> {
  const fileNames: Record<string, string> = {}

  const resolveList = async (names: string[]): Promise<string[]> => {
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

  for (const name of await resolveList(loadNames)) {
    fileNames[name] = "mcfunction_load_file"
  }
  for (const name of await resolveList(tickNames)) {
    fileNames[name] = "mcfunction_tick_file"
  }

  return fileNames
}

function mergeLoadTick(
  dynamic: Record<string, string>,
  custom: Record<string, string>
): Record<string, string> {
  const fileNames: Record<string, string> = {}
  for (const key of Object.keys(dynamic)) {
    const base = key.includes("/") ? key.split("/").pop() || key : key
    if (!(base in custom)) {
      fileNames[key] = dynamic[key]
    }
  }
  Object.assign(fileNames, custom)
  return fileNames
}

export async function collectJavaLoadTick(
  fs: FileSystemPort,
  options: {
    dynamicFunctionIcons: boolean
    loadFunctionNames: string[]
    tickFunctionNames: string[]
    onLoadTickNamingConflict?: () => void
  }
): Promise<Record<string, string>> {
  let dynamicResult: Record<string, string> = {}
  if (options.dynamicFunctionIcons) {
    const load = await collectFromTagFiles(fs, "load", "mcfunction_load_file")
    const tick = await collectFromTagFiles(fs, "tick", "mcfunction_tick_file")
    dynamicResult = { ...load, ...tick }
  }

  const loadNames = options.loadFunctionNames
  const tickNames = options.tickFunctionNames
  if (
    loadNames.length > 0 &&
    tickNames.length > 0 &&
    loadNames.some((item) => tickNames.includes(item))
  ) {
    options.onLoadTickNamingConflict?.()
    return mergeLoadTick(dynamicResult, {})
  }

  const customResult = await collectFromCustomLists(fs, loadNames, tickNames)
  return mergeLoadTick(dynamicResult, customResult)
}

export async function collectBedrockTick(
  fs: FileSystemPort,
  options: {
    dynamicFunctionIcons: boolean
    tickFunctionNames: string[]
  }
): Promise<Record<string, string>> {
  let dynamicResult: Record<string, string> = {}
  if (options.dynamicFunctionIcons) {
    dynamicResult = await collectFromTagFiles(fs, "tick", "mcfunction_tick_file")
  }

  const customResult = await collectFromCustomLists(fs, [], options.tickFunctionNames)
  return mergeLoadTick(dynamicResult, customResult)
}
