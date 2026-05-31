/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll, beforeEach } from "bun:test"
import { mockVscodeState, createMockVscode } from "./helpers"

mock.module("vscode", createMockVscode)

let getSubFolderFiles: () => Promise<Record<string, string>>

beforeAll(async () => {
  mockVscodeState.configStore["mc-dp-icons.subfolderIcons"] = true

  mockVscodeState.workspaceFoldersResult = [
    { uri: { fsPath: "/bp" } },
    { uri: { fsPath: "/bp2" } },
  ]

  mockVscodeState.readDirectoryResult = (dirPath: string) => {
    switch (dirPath) {
      case "/bp":
        return [
          ["manifest.json", 1],
          ["recipes", 2],
          ["loot_tables", 2],
          ["tags", 2],
          ["unknown_folder", 2],
        ]
      case "/bp/recipes":
        return [["types", 2]]
      case "/bp/recipes/types":
        return [["smelting.json", 1]]
      case "/bp/loot_tables":
        return [["chests", 2]]
      case "/bp/loot_tables/chests":
        return [["data.json", 1], ["sub", 2]]
      case "/bp/loot_tables/chests/sub":
        return [["deep.json", 1]]
      case "/bp/tags":
        return [["functions", 2], ["blocks", 2]]
      case "/bp/tags/functions":
        return [["tick.json", 1], ["load.json", 1]]
      case "/bp/tags/blocks":
        return [["wood.json", 1]]
      case "/bp/unknown_folder":
        return [["inner", 2]]
      case "/bp/unknown_folder/inner":
        return [["file.json", 1]]
      case "/bp2":
        return [
          ["manifest.json", 1],
          ["recipes", 2],
        ]
      case "/bp2/recipes":
        return [["types", 2]]
      case "/bp2/recipes/types":
        return [["campfire.json", 1]]
      default:
        return []
    }
  }

  const mod = await import("../src/dynamicIcons/bedrock/getSubFolderFiles")
  getSubFolderFiles = mod.getSubFolderFiles
})

beforeEach(() => {
  mockVscodeState.configStore["mc-dp-icons.subfolderIcons"] = true
  mockVscodeState.showWarningMessage = undefined
})

describe("getSubFolderFiles (Bedrock)", () => {
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
    expect(result["inner/file.json"]).toBeUndefined()
  })

  test("handles nested files at depth 4 returning last-2 segments", async () => {
    const result = await getSubFolderFiles()
    expect(result["sub/deep.json"]).toBe("loot_table_file")
  })

  test("excludes function tick/load files from results", async () => {
    const result = await getSubFolderFiles()
    expect(result["functions/tick.json"]).toBeUndefined()
    expect(result["functions/load.json"]).toBeUndefined()
    expect(result["blocks/wood.json"]).toBe("tags_file")
  })

  test("maps files to correct icons and merges across multiple manifests", async () => {
    const result = await getSubFolderFiles()
    expect(result["types/smelting.json"]).toBe("recipe_file")
    expect(result["types/campfire.json"]).toBe("recipe_file")
  })
})
