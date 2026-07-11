/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll } from "bun:test"
import { mockVscodeState, createMockVscode } from "./helpers"

mock.module("vscode", createMockVscode)

let getConfig: (name: string) => unknown
let changeGlobalConfig: (key: string, value: unknown) => Thenable<void>
let changeWorkspaceConfig: (key: string, value: unknown) => Thenable<void>

beforeAll(async () => {
  const mod = await import("../src/configuration/configManager")
  getConfig = mod.getConfig
  changeGlobalConfig = mod.changeGlobalConfig
  changeWorkspaceConfig = mod.changeWorkspaceConfig
})

describe("configManager", () => {
  test("getConfig returns default when not set", () => {
    expect(getConfig("workspaceDetection")).toBe(false)
    expect(getConfig("dynamicFunctionIcons")).toBe(true)
    expect(getConfig("subfolderIcons")).toBe(true)
    expect(getConfig("hideFolderArrows")).toBe(false)
    expect(getConfig("tooManyFilesWarningDismissed")).toBe(false)
    expect(getConfig("debug")).toBe(false)
  })

  test("getConfig returns set value when configured", () => {
    mockVscodeState.configStore["mc-dp-icons.workspaceDetection"] = true
    expect(getConfig("workspaceDetection")).toBe(true)
  })

  test("changeGlobalConfig calls update with Global target", async () => {
    await changeGlobalConfig("mc-dp-icons.testKey", "testValue")
    expect(mockVscodeState.configStore["mc-dp-icons.testKey"]).toBe("testValue")
  })

  test("changeWorkspaceConfig calls update with Workspace target", async () => {
    await changeWorkspaceConfig("mc-dp-icons.testKey", "workspaceValue")
    expect(mockVscodeState.configStore["mc-dp-icons.testKey"]).toBe("workspaceValue")
  })
})
