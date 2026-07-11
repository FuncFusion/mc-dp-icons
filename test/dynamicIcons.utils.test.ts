/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll, beforeEach } from "bun:test"
import { mockVscodeState, createMockVscode, resetMockState } from "./helpers"

mock.module("vscode", createMockVscode)

let usesPartialMatch: (array: string[]) => boolean
let processList: (list: string[]) => Promise<string[]>
let filterSegmentDepth: (names: string[]) => { valid: string[], invalid: string[] }
let getReferencesFromFunctionTags: (namespace: string, functionTag: string) => Promise<string[]>
let safeCollect: <T>(fn: () => Promise<T>, name: string, fallback: T) => Promise<T>
let getSubFolderFiles: (subfolderReference: () => Promise<{ subfolders: Record<string, string[]>, totalFiles: number }>) => Promise<Record<string, string>>

beforeAll(async () => {
  const mod = await import("../src/dynamicIcons/utils")
  usesPartialMatch = mod.usesPartialMatch
  processList = mod.processList
  filterSegmentDepth = mod.filterSegmentDepth
  getReferencesFromFunctionTags = mod.getReferencesFromFunctionTags
  safeCollect = mod.safeCollect
  getSubFolderFiles = mod.getSubFolderFiles
})

beforeEach(() => {
  resetMockState()
  mockVscodeState.configStore["mc-dp-icons.subfolderIcons"] = true
})

describe("usesPartialMatch", () => {
  test("detects wildcards and glob metacharacters", () => {
    expect(usesPartialMatch(["*.txt"])).toBe(true)
    expect(usesPartialMatch(["?"])).toBe(true)
    expect(usesPartialMatch(["[0-9]"])).toBe(true)
    expect(usesPartialMatch(["exact"])).toBe(false)
    expect(usesPartialMatch([])).toBe(false)
  })

  test("processList handles empty array", async () => {
    expect(await processList([])).toEqual([])
  })
})

describe("filterSegmentDepth", () => {
  test("keeps names with 1 segment", () => {
    const { valid, invalid } = filterSegmentDepth(["func"])
    expect(valid).toEqual(["func"])
    expect(invalid).toEqual([])
  })

  test("keeps names with 2 segments", () => {
    const { valid, invalid } = filterSegmentDepth(["foo/func"])
    expect(valid).toEqual(["foo/func"])
    expect(invalid).toEqual([])
  })

  test("filters names with 3+ segments", () => {
    const { valid, invalid } = filterSegmentDepth(["a/b/c", "w/x/y/z"])
    expect(valid).toEqual([])
    expect(invalid).toEqual(["a/b/c", "w/x/y/z"])
  })

  test("separates mixed input correctly", () => {
    const { valid, invalid } = filterSegmentDepth(["good/func", "bad/a/b", "func"])
    expect(valid).toEqual(["good/func", "func"])
    expect(invalid).toEqual(["bad/a/b"])
  })

  test("handles empty input", () => {
    const { valid, invalid } = filterSegmentDepth([])
    expect(valid).toEqual([])
    expect(invalid).toEqual([])
  })
})

describe("processList", () => {
  test("appends .mcfunction to each name without wildcards", async () => {
    expect(await processList(["init", "tick"])).toEqual([
      "init.mcfunction",
      "tick.mcfunction",
    ])
  })

  test("resolves wildcards via findFiles returning last-2-segments", async () => {
    mockVscodeState.findFilesResult = (include: string) => {
      if (include.includes("setup_")) {
        return [
          { fsPath: "/dp/data/minecraft/functions/setup_main.mcfunction", path: "/dp/data/minecraft/functions/setup_main.mcfunction" },
          { fsPath: "/dp/data/minecraft/functions/setup_debug.mcfunction", path: "/dp/data/minecraft/functions/setup_debug.mcfunction" },
        ]
      }
      return []
    }

    const result = await processList(["setup_*"])
    expect(result).toEqual([
      "functions/setup_main.mcfunction",
      "functions/setup_debug.mcfunction",
    ])
  })
})

describe("getReferencesFromFunctionTags", () => {
  test("returns paths from string entries", async () => {
    mockVscodeState.findFilesResult = (include: string) => {
      if (include.includes("tick.json")) {
        return [{ fsPath: "/dp/data/minecraft/tags/functions/tick.json", path: "/dp/data/minecraft/tags/functions/tick.json" }]
      }
      return []
    }
    mockVscodeState.tagContents["/dp/data/minecraft/tags/functions/tick.json"] =
      JSON.stringify({ values: ["minecraft:main", "minecraft:setup/init"] })
    const result = await getReferencesFromFunctionTags("minecraft", "tick")
    expect(result).toContain("functions/main.mcfunction")
    expect(result).toContain("setup/init.mcfunction")
  })

  test("handles object entries with id field", async () => {
    mockVscodeState.findFilesResult = (include: string) => {
      if (include.includes("tick.json")) {
        return [{ fsPath: "/dp/data/minecraft/tags/functions/tick.json", path: "/dp/data/minecraft/tags/functions/tick.json" }]
      }
      return []
    }
    mockVscodeState.tagContents["/dp/data/minecraft/tags/functions/tick.json"] =
      JSON.stringify({ values: [{ id: "minecraft:main" }, { id: "minecraft:init" }] })
    const result = await getReferencesFromFunctionTags("minecraft", "tick")
    expect(result).toContain("functions/main.mcfunction")
    expect(result).toContain("functions/init.mcfunction")
  })

  test("handles mixed string and object entries", async () => {
    mockVscodeState.findFilesResult = (include: string) => {
      if (include.includes("tick.json")) {
        return [{ fsPath: "/dp/data/minecraft/tags/functions/tick.json", path: "/dp/data/minecraft/tags/functions/tick.json" }]
      }
      return []
    }
    mockVscodeState.tagContents["/dp/data/minecraft/tags/functions/tick.json"] =
      JSON.stringify({ values: ["minecraft:main", { id: "minecraft:init" }] })
    const result = await getReferencesFromFunctionTags("minecraft", "tick")
    expect(result).toContain("functions/main.mcfunction")
    expect(result).toContain("functions/init.mcfunction")
  })

  test("skips non-namespaced IDs", async () => {
    mockVscodeState.findFilesResult = (include: string) => {
      if (include.includes("tick.json")) {
        return [{ fsPath: "/dp/data/minecraft/tags/functions/tick.json", path: "/dp/data/minecraft/tags/functions/tick.json" }]
      }
      return []
    }
    mockVscodeState.tagContents["/dp/data/minecraft/tags/functions/tick.json"] =
      JSON.stringify({ values: ["minecraft:main", "local_func", "other:thing"] })
    const result = await getReferencesFromFunctionTags("minecraft", "tick")
    expect(result).toContain("functions/main.mcfunction")
    expect(result).toContain("functions/thing.mcfunction")
    expect(result).not.toContain("functions/local_func.mcfunction")
  })

  test("returns empty for empty values array", async () => {
    mockVscodeState.findFilesResult = (include: string) => {
      if (include.includes("tick.json")) {
        return [{ fsPath: "/dp/data/minecraft/tags/functions/tick.json", path: "/dp/data/minecraft/tags/functions/tick.json" }]
      }
      return []
    }
    mockVscodeState.tagContents["/dp/data/minecraft/tags/functions/tick.json"] =
      JSON.stringify({ values: [] })
    const result = await getReferencesFromFunctionTags("minecraft", "tick")
    expect(result).toEqual([])
  })

  test("returns empty when no tag files found", async () => {
    const result = await getReferencesFromFunctionTags("minecraft", "tick")
    expect(result).toEqual([])
  })
})

describe("safeCollect", () => {
  test("returns fn result when fn succeeds", async () => {
    const result = await safeCollect(() => Promise.resolve("success"), "test", "fallback")
    expect(result).toBe("success")
  })

  test("returns fallback when fn throws", async () => {
    const result = await safeCollect(() => Promise.reject(new Error("fail")), "test", "fallback")
    expect(result).toBe("fallback")
  })
})

describe("getSubFolderFiles", () => {
  test("returns file names from subfolder result", async () => {
    const subfolderRef = () => Promise.resolve({
      subfolders: { advancements: ["story/data.json", "other/data.json"], loot_tables: ["chests/data.json"] },
      totalFiles: 5,
    })
    const result = await getSubFolderFiles(subfolderRef)
    expect(result["story/data.json"]).toBe("advancement_file")
    expect(result["chests/data.json"]).toBe("loot_table_file")
  })

  test("returns empty when subfolderIcons disabled", async () => {
    mockVscodeState.configStore["mc-dp-icons.subfolderIcons"] = false
    const subfolderRef = () => Promise.resolve({
      subfolders: { advancements: ["story/data.json"] },
      totalFiles: 1,
    })
    const result = await getSubFolderFiles(subfolderRef)
    expect(Object.keys(result).length).toBe(0)
  })

  test("calls warnAboutTooManyFiles when totalFiles >= 10000", async () => {
    const subfolderRef = () => Promise.resolve({
      subfolders: { advancements: ["story/data.json"] },
      totalFiles: 10000,
    })
    await getSubFolderFiles(subfolderRef)
    expect(mockVscodeState.showWarningMessage).toContain("Too many files")
  })

  test("does not warn when totalFiles < 10000", async () => {
    const subfolderRef = () => Promise.resolve({
      subfolders: { advancements: ["story/data.json"] },
      totalFiles: 9999,
    })
    await getSubFolderFiles(subfolderRef)
    expect(mockVscodeState.showWarningMessage).toBeUndefined()
  })
})
