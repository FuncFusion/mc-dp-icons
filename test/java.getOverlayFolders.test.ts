/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll } from "bun:test"
import { mockVscodeState, createMockVscode } from "./helpers"

mock.module("vscode", createMockVscode)

let getOverlayFolders: (mcmetaFiles: { fsPath: string }[]) => Promise<Record<string, string>>

const mockMcmetaFiles = [{ fsPath: "/dp/pack.mcmeta" }]

beforeAll(async () => {
  mockVscodeState.configStore["mc-dp-icons.overlayIcons"] = true
  mockVscodeState.existingPaths.add("/dp")
  mockVscodeState.existingPaths.add("/dp/more_data/data")
  mockVscodeState.readDirectoryResult = (dirPath: string) => {
    if (dirPath === "/dp") {
      return [
        ["eula", 2],
        ["more_data", 2],
      ]
    }
    return []
  }
  const mod = await import("../src/dynamicIcons/java/getOverlayFolders")
  getOverlayFolders = mod.getOverlayFolders
})

describe("getOverlayFolders", () => {
  test("returns overlays with data or assets as overlay_folder icon", async () => {
    const result = await getOverlayFolders(mockMcmetaFiles)
    expect(result["dp/more_data"]).toBe("overlay_folder")
    expect(Object.keys(result).length).toBe(1)
  })

  test("returns empty when config overlayIcons is false", async () => {
    mockVscodeState.configStore["mc-dp-icons.overlayIcons"] = false
    const result = await getOverlayFolders(mockMcmetaFiles)
    expect(Object.keys(result).length).toBe(0)
  })

  test("skips directories without data or assets", async () => {
    mockVscodeState.configStore["mc-dp-icons.overlayIcons"] = true
    mockVscodeState.readDirectoryResult = (dirPath: string) => {
      if (dirPath === "/dp") {
        return [
          ["eula", 2],
          ["some_no_data", 2],
        ]
      }
      if (dirPath === "/dp/some_no_data") {
        return [["readme.txt", 1]]
      }
      return []
    }
    const result = await getOverlayFolders(mockMcmetaFiles)
    expect(result["dp/some_no_data"]).toBeUndefined()
    expect(Object.keys(result).length).toBe(0)
  })
})
