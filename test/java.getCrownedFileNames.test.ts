/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll } from "bun:test"
import { mockVscodeState, createMockVscode } from "./helpers"

mock.module("vscode", createMockVscode)

let getCrownedFileNames: () => Promise<Record<string, string>>

beforeAll(async () => {
  mockVscodeState.configStore["mc-dp-icons.crownedFunctions"] = ["a", "b"]
  mockVscodeState.configStore["mc-dp-icons.crownedLoadFunctions"] = []
  mockVscodeState.configStore["mc-dp-icons.crownedTickFunctions"] = ["c"]
  const mod = await import("../src/dynamicIcons/java/getCrownedFileNames")
  getCrownedFileNames = mod.getCrownedFileNames
})

describe("getCrownedFileNames", () => {
  test("maps crownedFunctions to mcfunction_file_crowned", async () => {
    const result = await getCrownedFileNames()
    expect(result["a.mcfunction"]).toBe("mcfunction_file_crowned")
    expect(result["b.mcfunction"]).toBe("mcfunction_file_crowned")
  })

  test("maps crownedTickFunctions to mcfunction_tick_file_crowned", async () => {
    const result = await getCrownedFileNames()
    expect(result["c.mcfunction"]).toBe("mcfunction_tick_file_crowned")
  })

  test("does not map empty crownedLoadFunctions", async () => {
    const result = await getCrownedFileNames()
    expect(Object.keys(result)).not.toContain(
      expect.stringContaining("load_file_crowned")
    )
  })
})
