/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll } from "bun:test"
import { mockVscodeState, createMockVscode } from "./helpers"

mock.module("vscode", createMockVscode)

let getOverlayFolders: () => Promise<Record<string, string>>

beforeAll(async () => {
  mockVscodeState.configStore["mc-dp-icons.overlayIcons"] = true
  mockVscodeState.findFilesResult = (include: string) => {
    if (include.includes("pack.mcmeta")) {
      return [{ fsPath: "/dp/pack.mcmeta", path: "/dp/pack.mcmeta" }]
    }
    return []
  }
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
  test("returns overlays with data XOR assets as overlay_folder icon", async () => {
    const result = await getOverlayFolders()
    expect(result["dp/more_data"]).toBe("overlay_folder")
    expect(Object.keys(result).length).toBe(1)
  })

  test("returns empty when config overlayIcons is false", async () => {
    mockVscodeState.configStore["mc-dp-icons.overlayIcons"] = false
    const result = await getOverlayFolders()
    expect(Object.keys(result).length).toBe(0)
  })
})
