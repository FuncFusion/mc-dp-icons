/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll, beforeEach } from "bun:test"
import { mockVscodeState, createMockVscode, resetMockState } from "./helpers"

mock.module("vscode", createMockVscode)

let workspaceDetection: () => Promise<void>
let isMinecraftWorkspace: () => Promise<boolean>

const defaultConfig = {
  "mc-dp-icons.workspaceDetection": true,
  "mc-dp-icons.fallbackIconTheme": "",
}

beforeAll(async () => {
  const mod = await import("../src/dynamicIcons/workspace")
  workspaceDetection = mod.workspaceDetection
  isMinecraftWorkspace = mod.isMinecraftWorkspace
})

beforeEach(() => {
  resetMockState()
  mockVscodeState.configStore = { ...defaultConfig }
})

describe("isMinecraftWorkspace", () => {
  test("returns true when pack.mcmeta exists", async () => {
    mockVscodeState.findFilesResult = (include: string) => {
      if (include.includes("pack.mcmeta")) {
        return [{ fsPath: "/dp/pack.mcmeta", path: "/dp/pack.mcmeta" }]
      }
      return []
    }
    expect(await isMinecraftWorkspace()).toBe(true)
  })

  test("returns true when jmc_config.json exists", async () => {
    mockVscodeState.findFilesResult = (include: string) => {
      if (include.includes("jmc_config")) {
        return [{ fsPath: "/dp/jmc_config.json", path: "/dp/jmc_config.json" }]
      }
      return []
    }
    expect(await isMinecraftWorkspace()).toBe(true)
  })

  test("returns true when beet config exists", async () => {
    mockVscodeState.findFilesResult = (include: string) => {
      if (include.includes("beet")) {
        return [{ fsPath: "/dp/beet.yaml", path: "/dp/beet.yaml" }]
      }
      return []
    }
    expect(await isMinecraftWorkspace()).toBe(true)
  })

  test("returns true when manifest.json has format_version", async () => {
    mockVscodeState.findFilesResult = (include: string) => {
      if (include.includes("manifest")) {
        return [{ fsPath: "/bp/manifest.json", path: "/bp/manifest.json" }]
      }
      return []
    }
    mockVscodeState.tagContents["/bp/manifest.json"] = JSON.stringify({ format_version: 2 })
    expect(await isMinecraftWorkspace()).toBe(true)
  })

  test("returns false when manifest.json lacks format_version", async () => {
    mockVscodeState.findFilesResult = (include: string) => {
      if (include.includes("manifest")) {
        return [{ fsPath: "/bp/manifest.json", path: "/bp/manifest.json" }]
      }
      return []
    }
    mockVscodeState.tagContents["/bp/manifest.json"] = JSON.stringify({ name: "my_pack" })
    expect(await isMinecraftWorkspace()).toBe(false)
  })

  test("returns false when no MC files found", async () => {
    mockVscodeState.findFilesResult = () => []
    expect(await isMinecraftWorkspace()).toBe(false)
  })

  test("handles malformed manifest.json gracefully", async () => {
    mockVscodeState.findFilesResult = (include: string) => {
      if (include.includes("manifest")) {
        return [{ fsPath: "/bp/manifest.json", path: "/bp/manifest.json" }]
      }
      return []
    }
    mockVscodeState.tagContents["/bp/manifest.json"] = "not json"
    expect(await isMinecraftWorkspace()).toBe(false)
  })
})

describe("workspaceDetection", () => {
  test("skips when workspaceDetection config is false", async () => {
    mockVscodeState.configStore["mc-dp-icons.workspaceDetection"] = false
    await workspaceDetection()
    expect(mockVscodeState.lastWrittenPath).toBe("")
  })

  test("skips config write when userDefaultTheme is undefined", async () => {
    mockVscodeState.findFilesResult = () => []
    mockVscodeState.configStore["workbench.iconTheme"] = undefined
    await workspaceDetection()
    expect(mockVscodeState.lastWrittenPath).toBe("")
  })
})
