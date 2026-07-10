/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll } from "bun:test"
import { mockVscodeState, createMockVscode } from "./helpers"

mock.module("vscode", createMockVscode)

let getNamespaceFolders: (mcmetaFiles: { fsPath: string }[]) => Promise<Record<string, string>>

const mockMcmetaFiles = [{ fsPath: "/dp/pack.mcmeta" }]

beforeAll(async () => {
  mockVscodeState.configStore["mc-dp-icons.namespaceIcons"] = true
  mockVscodeState.existingPaths.add("/dp/assets")
  mockVscodeState.existingPaths.add("/dp/data")
  mockVscodeState.readDirectoryResult = (dirPath: string) => {
    if (dirPath === "/dp/assets" || dirPath === "/dp/data") {
      return [["minecraft", 2]]
    }
    return []
  }
  const mod = await import("../src/dynamicIcons/java/getNamespaceFolders")
  getNamespaceFolders = mod.getNamespaceFolders
})

describe("getNamespaceFolders", () => {
  test("returns namespace folders as namespace_folder icon", async () => {
    const result = await getNamespaceFolders(mockMcmetaFiles)
    expect(result["data/minecraft"]).toBe("namespace_folder")
    expect(result["assets/minecraft"]).toBe("namespace_folder")
  })

  test("returns empty when config namespaceIcons is false", async () => {
    mockVscodeState.configStore["mc-dp-icons.namespaceIcons"] = false
    const result = await getNamespaceFolders(mockMcmetaFiles)
    expect(Object.keys(result).length).toBe(0)
  })
})
