/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll } from "bun:test"
import { mockVscodeState, createMockVscode } from "./helpers"

mock.module("vscode", createMockVscode)

let getSubFolderFiles: () => Promise<Record<string, string>>

beforeAll(async () => {
  mockVscodeState.configStore["mc-dp-icons.subfolderIcons"] = true
  mockVscodeState.configStore["mc-dp-icons.namespaceIcons"] = true
  mockVscodeState.findFilesResult = (include: string) => {
    if (include.includes("pack.mcmeta")) {
      return [{ fsPath: "/dp/pack.mcmeta" }]
    }
    return []
  }
  mockVscodeState.existingPaths.add("/dp/data")
  const nsDir = "/dp/data/minecraft"
  mockVscodeState.existingPaths.add(nsDir)
  mockVscodeState.readDirectoryResult = (dirPath: string) => {
    if (dirPath === "/dp/data") {
      return [["minecraft", 2]]
    }
    if (dirPath === nsDir) {
      return [["advancements", 2]]
    }
    if (dirPath === nsDir + "/advancements") {
      return [["story", 2]]
    }
    if (dirPath === nsDir + "/advancements/story") {
      return [["data.json", 1]]
    }
    return []
  }
  const mod = await import("../src/dynamicIcons/java/getSubFolderFiles")
  getSubFolderFiles = mod.getSubFolderFiles
})

describe("getSubFolderFiles (Java)", () => {
  test("returns files in known subdirectories mapped to correct icons", async () => {
    const result = await getSubFolderFiles()
    expect(result["story/data.json"]).toBe("advancement_file")
  })

  test("returns empty when config subfolderIcons is false", async () => {
    mockVscodeState.configStore["mc-dp-icons.subfolderIcons"] = false
    const result = await getSubFolderFiles()
    expect(Object.keys(result).length).toBe(0)
  })
})
