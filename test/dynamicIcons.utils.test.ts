/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll } from "bun:test"
import { mockVscodeState, createMockVscode } from "./helpers"

mock.module("vscode", createMockVscode)

let usesPartialMatch: (array: string[]) => boolean
let processList: (list: string[]) => Promise<string[]>

beforeAll(async () => {
  const mod = await import("../src/dynamicIcons/utils")
  usesPartialMatch = mod.usesPartialMatch
  processList = mod.processList
})

describe("usesPartialMatch", () => {
  test("detects wildcards", () => {
    expect(usesPartialMatch(["setup_*"])).toBe(true)
    expect(usesPartialMatch(["init", "tick"])).toBe(false)
  })
})

describe("processList", () => {
  test("appends .mcfunction to each name without wildcards", async () => {
    expect(await processList(["init", "tick"])).toEqual([
      "init.mcfunction",
      "tick.mcfunction",
    ])
  })

  test("resolves wildcards via findFiles returning last-2-segments", async () => {
    mockVscodeState.findFilesResult = (include: string) => {
      if (include.includes("setup_")) {
        return [
          { fsPath: "/dp/data/minecraft/functions/setup_main.mcfunction" },
          { fsPath: "/dp/data/minecraft/functions/setup_debug.mcfunction" },
        ]
      }
      return []
    }

    const result = await processList(["setup_*"])
    expect(result).toEqual([
      "functions/setup_main.mcfunction",
      "functions/setup_debug.mcfunction",
    ])
  })
})
