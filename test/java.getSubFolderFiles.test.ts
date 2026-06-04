/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll, beforeEach } from "bun:test"
import { mockVscodeState, createMockVscode } from "./helpers"

mock.module("vscode", createMockVscode)

let getSubFolderFiles: () => Promise<Record<string, string>>

beforeAll(async () => {
  mockVscodeState.configStore["mc-dp-icons.subfolderIcons"] = true
  mockVscodeState.configStore["mc-dp-icons.namespaceIcons"] = true

  mockVscodeState.findFilesResult = (include: string) => {
    if (include.includes("pack.mcmeta")) {
      return [{ fsPath: "/dp/pack.mcmeta", path: "/dp/pack.mcmeta" }]
    }
    return []
  }

  mockVscodeState.existingPaths.add("/dp/data")
  mockVscodeState.existingPaths.add("/dp/data/minecraft")
  mockVscodeState.existingPaths.add("/dp/data/myaddon")

  mockVscodeState.readDirectoryResult = (dirPath: string) => {
    switch (dirPath) {
      case "/dp/data":
        return [["minecraft", 2], ["myaddon", 2]]
      case "/dp/data/minecraft":
        return [
          ["advancements", 2],
          ["loot_tables", 2],
          ["tags", 2],
          ["unknown_folder", 2],
        ]
      case "/dp/data/minecraft/advancements":
        return [["story", 2]]
      case "/dp/data/minecraft/advancements/story":
        return [["data.json", 1], ["quests", 2]]
      case "/dp/data/minecraft/advancements/story/quests":
        return [["deep.json", 1]]
      case "/dp/data/minecraft/loot_tables":
        return [["chests", 2]]
      case "/dp/data/minecraft/loot_tables/chests":
        return [["data.json", 1]]
      case "/dp/data/minecraft/tags":
        return [["functions", 2], ["blocks", 2]]
      case "/dp/data/minecraft/tags/functions":
        return [["tick.json", 1], ["load.json", 1]]
      case "/dp/data/minecraft/tags/blocks":
        return [["wood.json", 1]]
      case "/dp/data/minecraft/unknown_folder":
        return [["sub", 2]]
      case "/dp/data/minecraft/unknown_folder/sub":
        return [["file.json", 1]]
      case "/dp/data/myaddon":
        return [["advancements", 2]]
      case "/dp/data/myaddon/advancements":
        return [["custom", 2]]
      case "/dp/data/myaddon/advancements/custom":
        return [["data.json", 1]]
      default:
        return []
    }
  }

  const mod = await import("../src/dynamicIcons/java/getSubFolderFiles")
  getSubFolderFiles = mod.getSubFolderFiles
})

beforeEach(() => {
  mockVscodeState.configStore["mc-dp-icons.subfolderIcons"] = true
  mockVscodeState.configStore["mc-dp-icons.namespaceIcons"] = true
  mockVscodeState.showWarningMessage = undefined
})

describe("getSubFolderFiles (Java)", () => {
  test("returns empty when config subfolderIcons is false", async () => {
    mockVscodeState.configStore["mc-dp-icons.subfolderIcons"] = false
    const result = await getSubFolderFiles()
    expect(Object.keys(result).length).toBe(0)
  })

  test("handles multiple known subfolders", async () => {
    const result = await getSubFolderFiles()
    expect(result["chests/data.json"]).toBe("loot_table_file")
  })

  test("skips subfolders not in subfolderIconMap", async () => {
    const result = await getSubFolderFiles()
    expect(result["sub/file.json"]).toBeUndefined()
  })

  test("handles nested files at depth 4 returning last-2 segments", async () => {
    const result = await getSubFolderFiles()
    expect(result["quests/deep.json"]).toBe("advancement_file")
  })

  test("excludes function tick/load files from results", async () => {
    const result = await getSubFolderFiles()
    expect(result["functions/tick.json"]).toBeUndefined()
    expect(result["functions/load.json"]).toBeUndefined()
    expect(result["blocks/wood.json"]).toBe("tags_file")
  })

  test("maps files to correct icons and merges across namespaces", async () => {
    const result = await getSubFolderFiles()
    expect(result["story/data.json"]).toBe("advancement_file")
    expect(result["custom/data.json"]).toBe("advancement_file")
  })
})
