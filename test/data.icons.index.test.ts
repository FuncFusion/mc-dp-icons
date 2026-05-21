/// <reference types="bun-types" />
import { describe, test, expect } from "bun:test"
import { icons } from "../src/data/icons"

describe("icons registry", () => {
  test("exports a non-empty array of icon definitions", () => {
    expect(icons.length).toBeGreaterThan(0)
  })

  test("required generic icons exist", () => {
    const names = icons.map((i) => i.name)
    expect(names).toContain("generic_file")
    expect(names).toContain("generic_folder")
    expect(names).toContain("generic_folder_closed")
  })

  test("all icon names are unique", () => {
    const names = icons.map((i) => i.name)
    expect(new Set(names).size).toBe(names.length)
  })

  test("every icon has a name", () => {
    for (const icon of icons) {
      expect(icon.name).toBeTruthy()
    }
  })
})
