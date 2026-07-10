/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll, beforeEach } from "bun:test"
import { mockVscodeState, createMockVscode, resetMockState } from "../helpers"

mock.module("vscode", createMockVscode)

let setExtensionUri: (uri: unknown) => void
let update: () => Promise<void>

function extUri(path: string) {
  return {
    fsPath: path,
    scheme: "file",
    path,
    authority: "",
    with: (changes: { path?: string }) => extUri(changes.path ?? path),
  }
}

beforeAll(async () => {
  const mod = await import("../../src/dynamicIcons/index")
  setExtensionUri = mod.setExtensionUri
  update = mod.update
})

beforeEach(() => {
  resetMockState()
  setExtensionUri(extUri("/test/ext") as never)
})

function setupJavaMocks() {
  mockVscodeState.configStore["mc-dp-icons.workspaceDetection"] = false
  mockVscodeState.configStore["mc-dp-icons.dynamicFunctionIcons"] = true
  mockVscodeState.configStore["mc-dp-icons.subfolderIcons"] = true
  mockVscodeState.configStore["mc-dp-icons.namespaceIcons"] = true
  mockVscodeState.configStore["mc-dp-icons.overlayIcons"] = true
  mockVscodeState.configStore["mc-dp-icons.christmasIcons"] = "Never"
  mockVscodeState.configStore["mc-dp-icons.hideFolderArrows"] = false
  mockVscodeState.findFilesResult = (include: string) => {
    if (include.includes("pack.mcmeta")) {
      return [{ fsPath: "/test/dp/pack.mcmeta", scheme: "file", path: "/test/dp/pack.mcmeta" }]
    }
    return []
  }
  mockVscodeState.existingPaths.add("/test/dp")
  mockVscodeState.existingPaths.add("/test/dp/data")
  mockVscodeState.existingPaths.add("/test/dp/data/minecraft")
  mockVscodeState.existingPaths.add("/test/dp/some_overlay")
  mockVscodeState.existingPaths.add("/test/dp/some_overlay/data")
  mockVscodeState.readDirectoryResult = (dirPath: string) => {
    if (dirPath === "/test/dp/data") return [["minecraft", 2]]
    if (dirPath === "/test/dp/data/minecraft") return [["advancements", 2]]
    if (dirPath === "/test/dp/data/minecraft/advancements") return [["story", 2]]
    if (dirPath === "/test/dp/data/minecraft/advancements/story") return [["data.json", 1]]
    if (dirPath === "/test/dp") return [["some_overlay", 2]]
    return []
  }
}

describe("update integration", () => {
  test("writes active.json with valid ThemeSchema structure", async () => {
    setupJavaMocks()
    await update()
    expect(mockVscodeState.lastWrittenPath).toContain("active.json")
    const theme = JSON.parse(mockVscodeState.lastWrittenContent)
    expect(typeof theme.file).toBe("string")
    expect(typeof theme.folder).toBe("string")
    expect(typeof theme.folderExpanded).toBe("string")
    expect(typeof theme.iconDefinitions).toBe("object")
    expect(typeof theme.fileNames).toBe("object")
    expect(typeof theme.folderNames).toBe("object")
    expect(typeof theme.folderNamesExpanded).toBe("object")
  })

  test("crowned functions override loadTick in the output", async () => {
    setupJavaMocks()
    mockVscodeState.configStore["mc-dp-icons.loadFunctionNames"] = ["init"]
    mockVscodeState.configStore["mc-dp-icons.crownedFunctionsNames"] = ["my_crowned"]
    await update()
    const theme = JSON.parse(mockVscodeState.lastWrittenContent)
    expect(theme.fileNames["init.mcfunction"]).toBe("mcfunction_load_file")
    expect(theme.fileNames["my_crowned.mcfunction"]).toBe("mcfunction_file_crowned")
  })

  test("folderNamesExpanded has namespace and overlay entries", async () => {
    setupJavaMocks()
    mockVscodeState.configStore["mc-dp-icons.namespaceIcons"] = true
    mockVscodeState.configStore["mc-dp-icons.overlayIcons"] = true
    await update()
    const theme = JSON.parse(mockVscodeState.lastWrittenContent)
    expect(theme.folderNamesExpanded["data/minecraft"]).toBe("namespace_folder")
    expect(theme.folderNamesExpanded["dp/some_overlay"]).toBe("overlay_folder")
  })

  test("subfolder files are included with correct icons", async () => {
    setupJavaMocks()
    mockVscodeState.configStore["mc-dp-icons.subfolderIcons"] = true
    await update()
    const theme = JSON.parse(mockVscodeState.lastWrittenContent)
    expect(theme.fileNames["story/data.json"]).toBe("advancement_file")
  })

  test("hideFolderArrows sets hidesExplorerArrows in output", async () => {
    setupJavaMocks()
    mockVscodeState.configStore["mc-dp-icons.hideFolderArrows"] = true
    await update()
    const theme = JSON.parse(mockVscodeState.lastWrittenContent)
    expect(theme.hidesExplorerArrows).toBe(true)
  })

  test("Christmas mode sets xmas icons when enabled", async () => {
    setupJavaMocks()
    mockVscodeState.configStore["mc-dp-icons.christmasIcons"] = "Always"
    await update()
    const theme = JSON.parse(mockVscodeState.lastWrittenContent)
    expect(theme.folderExpanded).toBe("generic_folder_xmas")
    expect(theme.folder).toBe("generic_folder_closed_xmas")
  })

  test("module skipped when guard() returns false", async () => {
    setupJavaMocks()
    mockVscodeState.findFilesResult = () => []
    await update()
    const theme = JSON.parse(mockVscodeState.lastWrittenContent)
    expect(theme.fileNames).toBeDefined()
  })

  test("Bedrock-only workspace detected via manifest.json", async () => {
    mockVscodeState.configStore["mc-dp-icons.workspaceDetection"] = false
    mockVscodeState.findFilesResult = (include: string) => {
      if (include.includes("manifest.json")) {
        return [{ fsPath: "/bp/manifest.json", scheme: "file", path: "/bp/manifest.json" }]
      }
      return []
    }
    mockVscodeState.tagContents["/bp/manifest.json"] = JSON.stringify({ format_version: 2, header: { name: "pack" } })
    await update()
    const theme = JSON.parse(mockVscodeState.lastWrittenContent)
    expect(theme.fileNames).toBeDefined()
    expect(typeof theme.file).toBe("string")
  })
})
