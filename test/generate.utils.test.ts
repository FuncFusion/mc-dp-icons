/// <reference types="bun-types" />
import { describe, test, expect } from "bun:test"
import { buildSubfolderIconMap, applyXmasTheme } from "../src/generate/utils"
import type { ThemeSchema } from "../src/theme/types"

function emptySchema(): ThemeSchema {
  return {
    iconDefinitions: {},
    file: "generic_file",
    folder: "generic_folder_closed",
    folderExpanded: "generic_folder",
    fileExtensions: {},
    fileNames: {},
    folderNames: {},
    folderNamesExpanded: {},
    hidesExplorerArrows: false,
  }
}

describe("buildSubfolderIconMap", () => {
  test("maps _folder names to _file names when file icon exists", () => {
    const defs: Record<string, { iconPath: string }> = {
      json_file: { iconPath: "../icons/json_file.svg" },
    }
    const expanded: Record<string, string> = { "namespace/path": "json_folder" }
    const result = buildSubfolderIconMap(defs, expanded)
    expect(result["namespace/path"]).toBe("json_file")
  })

  test("skips folders whose file icon does not exist in iconDefinitions", () => {
    const defs: Record<string, { iconPath: string }> = {}
    const expanded: Record<string, string> = { "namespace/path": "missing_folder" }
    const result = buildSubfolderIconMap(defs, expanded)
    expect(Object.keys(result).length).toBe(0)
  })

  test("only replaces trailing _folder, not internal occurrences", () => {
    const defs: Record<string, { iconPath: string }> = {
      folder_file: { iconPath: "../icons/folder_file.svg" },
    }
    const expanded: Record<string, string> = { "x": "folder_folder" }
    const result = buildSubfolderIconMap(defs, expanded)
    expect(result["x"]).toBe("folder_file")
  })
})

describe("applyXmasTheme", () => {
  test("replaces icon paths for whitelisted entries with _xmas suffix", () => {
    const schema = emptySchema()
    schema.iconDefinitions.chest = { iconPath: "../icons/chest.svg" }
    const result = applyXmasTheme(schema, ["chest"], (n) => `../icons/${n}.svg`)
    expect(result.iconDefinitions.chest.iconPath).toBe("../icons/chest_xmas.svg")
  })

  test("does not mutate the original schema", () => {
    const schema = emptySchema()
    schema.iconDefinitions.chest = { iconPath: "../icons/chest.svg" }
    const original = schema.iconDefinitions.chest.iconPath
    applyXmasTheme(schema, ["chest"], (n) => `../icons/${n}.svg`)
    expect(schema.iconDefinitions.chest.iconPath).toBe(original)
  })

  test("skips whitelisted names not in iconDefinitions", () => {
    const schema = emptySchema()
    const result = applyXmasTheme(schema, ["nonexistent"], (n) => `../icons/${n}.svg`)
    expect(Object.keys(result.iconDefinitions).length).toBe(0)
  })

  test("only affects icons in the whitelist, not all icons", () => {
    const schema = emptySchema()
    schema.iconDefinitions.chest = { iconPath: "../icons/chest.svg" }
    schema.iconDefinitions.stick = { iconPath: "../icons/stick.svg" }
    const result = applyXmasTheme(schema, ["chest"], (n) => `../icons/${n}.svg`)
    expect(result.iconDefinitions.chest.iconPath).toBe("../icons/chest_xmas.svg")
    expect(result.iconDefinitions.stick.iconPath).toBe("../icons/stick.svg")
  })
})
