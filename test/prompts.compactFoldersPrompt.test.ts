/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll, beforeEach } from "bun:test"
import { mockVscodeState, createMockVscode, resetMockState } from "./helpers"

mock.module("vscode", createMockVscode)

let showCompactFoldersPrompt: (context: { globalState: { get: (key: string) => unknown; update: (key: string, val: unknown) => void } }) => Promise<void>

beforeAll(async () => {
  const mod = await import("../src/prompts/compactFoldersPrompt")
  showCompactFoldersPrompt = mod.showCompactFoldersPrompt
})

beforeEach(() => {
  resetMockState()
})

function makeContext() {
  return {
    globalState: {
      get: (key: string) => mockVscodeState.globalState[key],
      update: (key: string, val: unknown) => { mockVscodeState.globalState[key] = val },
    },
  }
}

function setupMcWorkspace(compactFoldersValue: boolean) {
  mockVscodeState.configStore["compactFolders"] = compactFoldersValue
  mockVscodeState.findFilesResult = (include: string) => {
    if (include.includes("pack.mcmeta")) {
      return [{ fsPath: "/dp/pack.mcmeta", path: "/dp/pack.mcmeta", scheme: "file" }]
    }
    return []
  }
  mockVscodeState.tagContents["/dp/pack.mcmeta"] = JSON.stringify({ pack: { pack_format: 15 } })
  mockVscodeState.existingPaths.add("/dp")
  mockVscodeState.existingPaths.add("/dp/pack.mcmeta")
}

describe("showCompactFoldersPrompt", () => {
  test("skips when already dismissed", async () => {
    mockVscodeState.globalState["mc-dp-icons.compactFoldersPromptDismissed"] = true
    await showCompactFoldersPrompt(makeContext() as never)
    expect(mockVscodeState.showInformationMessage).toBeUndefined()
  })

  test("skips when not MC workspace", async () => {
    await showCompactFoldersPrompt(makeContext() as never)
    expect(mockVscodeState.showInformationMessage).toBeUndefined()
  })

  test("skips when compactFolders already disabled", async () => {
    setupMcWorkspace(false)
    await showCompactFoldersPrompt(makeContext() as never)
    expect(mockVscodeState.showInformationMessage).toBeUndefined()
  })

  test("shows prompt for MC workspace with compact folders", async () => {
    setupMcWorkspace(true)
    await showCompactFoldersPrompt(makeContext() as never)
    expect(mockVscodeState.showInformationMessage).toContain("Compact Folders")
  })

  test("'Disable globally' click sets compactFolders global", async () => {
    setupMcWorkspace(true)
    mockVscodeState.showInformationMessageReturn = "Disable globally"
    await showCompactFoldersPrompt(makeContext() as never)
    await new Promise((r) => setTimeout(r, 10))
    expect(mockVscodeState.configStore["compactFolders"]).toBe(false)
  })

  test("'Don\\'t show again' click sets dismissed flag", async () => {
    setupMcWorkspace(true)
    mockVscodeState.showInformationMessageReturn = "Don't show again"
    await showCompactFoldersPrompt(makeContext() as never)
    await new Promise((r) => setTimeout(r, 10))
    expect(mockVscodeState.globalState["mc-dp-icons.compactFoldersPromptDismissed"]).toBe(true)
  })
})
