/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll, beforeEach } from "bun:test"
import { mockVscodeState, createMockVscode, resetMockState } from "./helpers"

mock.module("vscode", createMockVscode)

let warnAboutTooManyFiles: () => void

beforeAll(async () => {
  const mod = await import("../src/prompts/tooManyFilesPrompt")
  warnAboutTooManyFiles = mod.warnAboutTooManyFiles
})

beforeEach(() => {
  resetMockState()
})

describe("warnAboutTooManyFiles", () => {
  test("shows warning when dismissed flag is false", () => {
    warnAboutTooManyFiles()
    expect(mockVscodeState.showWarningMessage).toContain("Too many files")
  })

  test("does not show warning when dismissed flag is true", () => {
    mockVscodeState.configStore["mc-dp-icons.tooManyFilesWarningDismissed"] = true
    warnAboutTooManyFiles()
    expect(mockVscodeState.showWarningMessage).toBeUndefined()
  })

  test("shows correct warning message", () => {
    warnAboutTooManyFiles()
    expect(mockVscodeState.showWarningMessage).toBe(
      "Too many files in subsubfolders (Over 10000). Subfolder icons feature might not work properly. Would you like to disable this feature?"
    )
  })

  test("'Disable Globally' click sets subfolderIcons global", async () => {
    mockVscodeState.showWarningMessageReturn = "Disable Globally"
    warnAboutTooManyFiles()
    await new Promise((r) => setTimeout(r, 10))
    expect(mockVscodeState.configStore["mc-dp-icons.subfolderIcons"]).toBe(false)
  })

  test("'Disable in This Workspace' click sets subfolderIcons workspace", async () => {
    mockVscodeState.showWarningMessageReturn = "Disable in This Workspace"
    warnAboutTooManyFiles()
    await new Promise((r) => setTimeout(r, 10))
    expect(mockVscodeState.configStore["mc-dp-icons.subfolderIcons"]).toBe(false)
  })

  test("'Don\\'t show again' click sets dismissed flag", async () => {
    mockVscodeState.showWarningMessageReturn = "Don't show again"
    warnAboutTooManyFiles()
    await new Promise((r) => setTimeout(r, 10))
    expect(mockVscodeState.configStore["mc-dp-icons.tooManyFilesWarningDismissed"]).toBe(true)
  })
})
