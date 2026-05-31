/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll } from "bun:test"
import { mockVscodeState, createMockVscode } from "./helpers"

mock.module("vscode", createMockVscode)

let getUserFileNames: () => Promise<Record<string, string>>

beforeAll(async () => {
  mockVscodeState.configStore["mc-dp-icons.loadFunctionNames"] = []
  mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"] = []
  mockVscodeState.configStore["mc-dp-icons.crownedFunctionsNames"] = []
  mockVscodeState.configStore["mc-dp-icons.crownedLoadFunctionsNames"] = []
  mockVscodeState.configStore["mc-dp-icons.crownedTickFunctionsNames"] = []
  const mod = await import("../src/dynamicIcons/java/getUserFileNames")
  getUserFileNames = mod.getUserFileNames
})

describe("getUserFileNames", () => {
  test("maps tick and load config to correct icon names", async () => {
    mockVscodeState.configStore["mc-dp-icons.loadFunctionNames"] = ["my_load"]
    mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"] = ["my_tick"]

    const result = await getUserFileNames()
    expect(result["my_load.mcfunction"]).toBe("mcfunction_load_file")
    expect(result["my_tick.mcfunction"]).toBe("mcfunction_tick_file")
  })

  test("maps crowned functions with correct icon names", async () => {
    mockVscodeState.configStore["mc-dp-icons.crownedFunctionsNames"] = ["a", "b"]
    mockVscodeState.configStore["mc-dp-icons.crownedLoadFunctionsNames"] = []
    mockVscodeState.configStore["mc-dp-icons.crownedTickFunctionsNames"] = ["c"]

    const result = await getUserFileNames()
    expect(result["a.mcfunction"]).toBe("mcfunction_file_crowned")
    expect(result["b.mcfunction"]).toBe("mcfunction_file_crowned")
    expect(result["c.mcfunction"]).toBe("mcfunction_tick_file_crowned")
  })

  test("shows warning and returns empty on load/tick conflict", async () => {
    mockVscodeState.configStore["mc-dp-icons.loadFunctionNames"] = ["shared"]
    mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"] = ["shared"]

    const result = await getUserFileNames()
    expect(mockVscodeState.showWarningMessage).toContain("one special icon per file")
    expect(Object.keys(result).length).toBe(0)
  })

  test("shows warning on crowned vs load conflict", async () => {
    mockVscodeState.configStore["mc-dp-icons.loadFunctionNames"] = ["dup"]
    mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"] = []
    mockVscodeState.configStore["mc-dp-icons.crownedFunctionsNames"] = ["dup"]

    const result = await getUserFileNames()
    expect(mockVscodeState.showWarningMessage).toContain("one special icon per file")
    expect(Object.keys(result).length).toBe(0)
  })

  test("shows warning on crowned vs crownedTick conflict", async () => {
    mockVscodeState.configStore["mc-dp-icons.crownedFunctionsNames"] = ["dup"]
    mockVscodeState.configStore["mc-dp-icons.crownedTickFunctionsNames"] = ["dup"]

    const result = await getUserFileNames()
    expect(mockVscodeState.showWarningMessage).toContain("one special icon per file")
    expect(Object.keys(result).length).toBe(0)
  })

  test("returns empty when no configs are set", async () => {
    mockVscodeState.configStore["mc-dp-icons.loadFunctionNames"] = []
    mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"] = []
    mockVscodeState.configStore["mc-dp-icons.crownedFunctionsNames"] = []
    mockVscodeState.configStore["mc-dp-icons.crownedLoadFunctionsNames"] = []
    mockVscodeState.configStore["mc-dp-icons.crownedTickFunctionsNames"] = []

    const result = await getUserFileNames()
    expect(Object.keys(result).length).toBe(0)
  })
})
