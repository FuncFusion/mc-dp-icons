/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll } from "bun:test"
import { mockVscodeState, createMockVscode } from "./helpers"

mock.module("vscode", createMockVscode)

let getTickFileNames: () => Promise<Record<string, string>>

beforeAll(async () => {
  mockVscodeState.configStore["mc-dp-icons.dynamicFunctionIcons"] = true
  mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"] = []
  mockVscodeState.tagContents["/dp/tags/minecraft/tags/function/tick.json"] =
    JSON.stringify({ values: ["minecraft:main"] })
  mockVscodeState.findFilesResult = (include: string) => {
    if (include.includes("tick.json")) {
      return [{ fsPath: "/dp/tags/minecraft/tags/function/tick.json" }]
    }
    return []
  }
  const mod = await import("../src/dynamicIcons/bedrock/getTickFileNames")
  getTickFileNames = mod.getTickFileNames
})

describe("getTickFileNames (Bedrock)", () => {
  test("dynamic mode: returns tick from function tags", async () => {
    const result = await getTickFileNames()
    expect(result["function/main.mcfunction"]).toBe("mcfunction_tick_file")
  })

  test("custom overrides dynamic when basename collides", async () => {
    mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"] = ["main"]

    const result = await getTickFileNames()
    expect(result["main.mcfunction"]).toBe("mcfunction_tick_file")
    expect(result["function/main.mcfunction"]).toBeUndefined()
  })

  test("custom mode: returns tick from config when dynamic disabled", async () => {
    mockVscodeState.configStore["mc-dp-icons.dynamicFunctionIcons"] = false
    mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"] = ["my_tick"]

    const result = await getTickFileNames()
    expect(result["my_tick.mcfunction"]).toBe("mcfunction_tick_file")
  })

  test("returns empty when both dynamic disabled and no custom names", async () => {
    mockVscodeState.configStore["mc-dp-icons.dynamicFunctionIcons"] = false
    mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"] = []

    const result = await getTickFileNames()
    expect(Object.keys(result).length).toBe(0)
  })
})
