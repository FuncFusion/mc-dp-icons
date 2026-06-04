/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll } from "bun:test"
import { mockVscodeState, createMockVscode } from "./helpers"

mock.module("vscode", createMockVscode)

let usesPartialMatch: (array: string[]) => boolean
let processList: (list: string[]) => Promise<string[]>
let filterSegmentDepth: (names: string[]) => { valid: string[], invalid: string[] }

beforeAll(async () => {
  const mod = await import("../src/dynamicIcons/utils")
  usesPartialMatch = mod.usesPartialMatch
  processList = mod.processList
  filterSegmentDepth = mod.filterSegmentDepth
})

describe("usesPartialMatch", () => {
  test("detects wildcards", () => {
    expect(usesPartialMatch(["setup_*"])).toBe(true)
    expect(usesPartialMatch(["init", "tick"])).toBe(false)
  })
})

describe("filterSegmentDepth", () => {
  test("keeps names with 1 segment", () => {
    const { valid, invalid } = filterSegmentDepth(["func"])
    expect(valid).toEqual(["func"])
    expect(invalid).toEqual([])
  })

  test("keeps names with 2 segments", () => {
    const { valid, invalid } = filterSegmentDepth(["foo/func"])
    expect(valid).toEqual(["foo/func"])
    expect(invalid).toEqual([])
  })

  test("filters names with 3+ segments", () => {
    const { valid, invalid } = filterSegmentDepth(["a/b/c", "w/x/y/z"])
    expect(valid).toEqual([])
    expect(invalid).toEqual(["a/b/c", "w/x/y/z"])
  })

  test("separates mixed input correctly", () => {
    const { valid, invalid } = filterSegmentDepth(["good/func", "bad/a/b", "func"])
    expect(valid).toEqual(["good/func", "func"])
    expect(invalid).toEqual(["bad/a/b"])
  })

  test("handles empty input", () => {
    const { valid, invalid } = filterSegmentDepth([])
    expect(valid).toEqual([])
    expect(invalid).toEqual([])
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
          { fsPath: "/dp/data/minecraft/functions/setup_main.mcfunction", path: "/dp/data/minecraft/functions/setup_main.mcfunction" },
          { fsPath: "/dp/data/minecraft/functions/setup_debug.mcfunction", path: "/dp/data/minecraft/functions/setup_debug.mcfunction" },
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
