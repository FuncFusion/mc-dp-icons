/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll } from "bun:test"
import { mockVscodeState, createMockVscode } from "../helpers"

mock.module("vscode", createMockVscode)

let setExtensionUri: (uri: unknown) => void
let update: () => Promise<void>

beforeAll(async () => {
  const extUri = (() => {
    const wrap = (path: string) => ({
      fsPath: path,
      scheme: "file",
      path,
      authority: "",
      with: (changes: { path?: string }) => wrap(changes.path ?? path),
    })
    return wrap("/test/ext")
  })()

  mockVscodeState.configStore["mc-dp-icons.workspaceDetection"] = false
  mockVscodeState.configStore["mc-dp-icons.dynamicFunctionIcons"] = true
  mockVscodeState.configStore["mc-dp-icons.loadFunctionNames"] = ["init"]
  mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"] = ["main"]
  mockVscodeState.configStore["mc-dp-icons.crownedFunctionsNames"] = ["my_crowned"]
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
    if (dirPath === "/test/dp/data") {
      return [["minecraft", 2]]
    }
    if (dirPath === "/test/dp/data/minecraft") {
      return [["advancements", 2]]
    }
    if (dirPath === "/test/dp/data/minecraft/advancements") {
      return [["story", 2]]
    }
    if (dirPath === "/test/dp/data/minecraft/advancements/story") {
      return [["data.json", 1]]
    }
    if (dirPath === "/test/dp") {
      return [["some_overlay", 2]]
    }
    return []
  }

  const mod = await import("../../src/dynamicIcons/index")
  setExtensionUri = mod.setExtensionUri
  update = mod.update

  setExtensionUri(extUri as never)
})

describe("update integration", () => {
  test("writes active.json with valid ThemeSchema structure", async () => {
    mockVscodeState.lastWrittenPath = ""
    mockVscodeState.lastWrittenContent = ""
    mockVscodeState.createdDirPaths = []

    await update()

    expect(mockVscodeState.createdDirPaths.length).toBeGreaterThanOrEqual(1)
    expect(mockVscodeState.lastWrittenPath).toContain("active.json")

    const theme = JSON.parse(mockVscodeState.lastWrittenContent)
    expect(theme).toBeDefined()
    expect(typeof theme).toBe("object")
    expect(typeof theme.file).toBe("string")
    expect(typeof theme.folder).toBe("string")
    expect(typeof theme.folderExpanded).toBe("string")
    expect(typeof theme.iconDefinitions).toBe("object")
    expect(typeof theme.fileNames).toBe("object")
    expect(typeof theme.folderNames).toBe("object")
    expect(typeof theme.folderNamesExpanded).toBe("object")
    expect(typeof theme.hidesExplorerArrows).toBe("boolean")
  })

  test("crowned functions override loadTick in the output", async () => {
    mockVscodeState.lastWrittenPath = ""
    mockVscodeState.lastWrittenContent = ""

    await update()

    const theme = JSON.parse(mockVscodeState.lastWrittenContent)
    expect(theme.fileNames["init.mcfunction"]).toBe("mcfunction_load_file")
    expect(theme.fileNames["my_crowned.mcfunction"]).toBe("mcfunction_file_crowned")
  })

  test("folderNamesExpanded has namespace and overlay entries", async () => {
    mockVscodeState.lastWrittenPath = ""
    mockVscodeState.lastWrittenContent = ""

    await update()

    const theme = JSON.parse(mockVscodeState.lastWrittenContent)
    const folderKeys = Object.keys(theme.folderNamesExpanded)
    expect(folderKeys.length).toBeGreaterThan(0)
    expect(theme.folderNamesExpanded["data/minecraft"]).toBe("namespace_folder")
    expect(theme.folderNamesExpanded["dp/some_overlay"]).toBe("overlay_folder")
  })

  test("subfolder files are included with correct icons", async () => {
    mockVscodeState.lastWrittenPath = ""
    mockVscodeState.lastWrittenContent = ""

    await update()

    const theme = JSON.parse(mockVscodeState.lastWrittenContent)
    expect(theme.fileNames["story/data.json"]).toBe("advancement_file")
  })
})
