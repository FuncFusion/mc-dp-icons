/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll } from "bun:test"
import { mockVscodeState, createMockVscode } from "./helpers"

mock.module("vscode", createMockVscode)

let getLoadTickFileNames: () => Promise<Record<string, string>>

beforeAll(async () => {
  mockVscodeState.configStore["mc-dp-icons.dynamicFunctionIcons"] = true
  mockVscodeState.configStore["mc-dp-icons.loadFunctionNames"] = []
  mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"] = []
  mockVscodeState.tagContents["/dp/data/minecraft/tags/function/tick.json"] =
    JSON.stringify({ values: ["minecraft:tick_main"] })
  mockVscodeState.tagContents["/dp/data/minecraft/tags/function/load.json"] =
    JSON.stringify({ values: ["minecraft:init"] })
  mockVscodeState.findFilesResult = (include: string) => {
    const paths = include.includes("tick")
      ? ["/dp/data/minecraft/tags/function/tick.json"]
      : include.includes("load")
        ? ["/dp/data/minecraft/tags/function/load.json"]
        : []
    return paths.map((p) => ({ fsPath: p }))
  }
  const mod = await import("../src/dynamicIcons/java/getLoadTickFileNames")
  getLoadTickFileNames = mod.getLoadTickFileNames
})

describe("getLoadTickFileNames", () => {
  test("dynamic mode: returns tick and load from function tags", async () => {
    const result = await getLoadTickFileNames()
    expect(result["function/tick_main.mcfunction"]).toBe("mcfunction_tick_file")
    expect(result["function/init.mcfunction"]).toBe("mcfunction_load_file")
  })

  test("custom overrides dynamic when basename collides", async () => {
    mockVscodeState.configStore["mc-dp-icons.loadFunctionNames"] = ["tick_main"]
    mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"] = []

    const result = await getLoadTickFileNames()
    expect(result["tick_main.mcfunction"]).toBe("mcfunction_load_file")
    expect(result["function/tick_main.mcfunction"]).toBeUndefined()
    expect(result["function/init.mcfunction"]).toBe("mcfunction_load_file")
  })

  test("custom mode: returns tick and load from config when dynamic disabled", async () => {
    mockVscodeState.configStore["mc-dp-icons.dynamicFunctionIcons"] = false
    mockVscodeState.configStore["mc-dp-icons.loadFunctionNames"] = ["my_load"]
    mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"] = ["my_tick"]

    const result = await getLoadTickFileNames()
    expect(result["my_load.mcfunction"]).toBe("mcfunction_load_file")
    expect(result["my_tick.mcfunction"]).toBe("mcfunction_tick_file")
  })

  test("conflicting load/tick custom names shows warning and returns empty", async () => {
    mockVscodeState.configStore["mc-dp-icons.dynamicFunctionIcons"] = false
    mockVscodeState.configStore["mc-dp-icons.loadFunctionNames"] = ["shared"]
    mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"] = ["shared"]

    const result = await getLoadTickFileNames()
    expect(mockVscodeState.showWarningMessage).toContain("Naming Conflict")
    expect(Object.keys(result).length).toBe(0)
  })

  test("returns empty when both dynamic disabled and no custom names", async () => {
    mockVscodeState.configStore["mc-dp-icons.dynamicFunctionIcons"] = false
    mockVscodeState.configStore["mc-dp-icons.loadFunctionNames"] = []
    mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"] = []

    const result = await getLoadTickFileNames()
    expect(Object.keys(result).length).toBe(0)
  })
})
