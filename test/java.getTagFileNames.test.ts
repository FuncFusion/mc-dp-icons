/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll } from "bun:test"
import { mockVscodeState, createMockVscode } from "./helpers"

mock.module("vscode", createMockVscode)

let getTagFileNames: () => Promise<Record<string, string>>

beforeAll(async () => {
  mockVscodeState.configStore["mc-dp-icons.dynamicFunctionIcons"] = true
  mockVscodeState.tagContents["/dp/data/minecraft/tags/function/tick.json"] =
    JSON.stringify({ values: ["minecraft:main"] })
  mockVscodeState.tagContents["/dp/data/minecraft/tags/function/load.json"] =
    JSON.stringify({ values: ["minecraft:init"] })
  mockVscodeState.findFilesResult = (include: string) => {
    const paths = include.includes("tick")
      ? ["/dp/data/minecraft/tags/function/tick.json"]
      : include.includes("load")
        ? ["/dp/data/minecraft/tags/function/load.json"]
        : []
    return paths.map((p) => ({ fsPath: p, path: p }))
  }
  const mod = await import("../src/dynamicIcons/java/getTagFileNames")
  getTagFileNames = mod.getTagFileNames
})

describe("getTagFileNames", () => {
  test("returns tick and load from function tags", async () => {
    const result = await getTagFileNames()
    expect(result["function/main.mcfunction"]).toBe("mcfunction_tick_file")
    expect(result["function/init.mcfunction"]).toBe("mcfunction_load_file")
  })

  test("returns empty when dynamicFunctionIcons is false", async () => {
    mockVscodeState.configStore["mc-dp-icons.dynamicFunctionIcons"] = false

    const result = await getTagFileNames()
    expect(Object.keys(result).length).toBe(0)
  })
})
