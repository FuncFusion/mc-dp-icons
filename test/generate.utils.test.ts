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

describe("applyXmasTheme", () => {
  test("converts generic folder icons to xmas variants", () => {
    const schema = emptySchema()
    schema.iconDefinitions.generic_folder = { iconPath: "../icons/generic_folder.svg" }
    schema.iconDefinitions.generic_folder_closed = { iconPath: "../icons/generic_folder_closed.svg" }
    const result = applyXmasTheme(schema, ["generic_folder", "generic_folder_closed"])
    expect(result.folder).toBe("generic_folder_closed_xmas")
    expect(result.folderExpanded).toBe("generic_folder_xmas")
  })

  test("does not mutate the original schema", () => {
    const schema = emptySchema()
    schema.iconDefinitions.generic_folder = { iconPath: "../icons/generic_folder.svg" }
    schema.folderExpanded = "generic_folder"
    const original = schema.folderExpanded
    applyXmasTheme(schema, ["generic_folder"])
    expect(schema.folderExpanded).toBe(original)
  })

  test("skips whitelisted names not in iconDefinitions", () => {
    const schema = emptySchema()
    schema.folder = "nonexistent"
    schema.folderExpanded = "nonexistent"
    const result = applyXmasTheme(schema, ["nonexistent"])
    expect(result.iconDefinitions.nonexistent).toBeUndefined()
  })

  test("converts folderNames entries to xmas variants", () => {
    const schema = emptySchema()
    schema.iconDefinitions.my_folder = { iconPath: "../icons/my_folder.svg" }
    schema.iconDefinitions.my_folder_xmas = { iconPath: "../icons/my_folder_xmas.svg" }
    schema.folderNames["some/path"] = "my_folder"
    const result = applyXmasTheme(schema, ["my_folder"])
    expect(result.folderNames["some/path"]).toBe("my_folder_xmas")
  })

  test("converts folderNamesExpanded entries to xmas variants", () => {
    const schema = emptySchema()
    schema.iconDefinitions.my_folder = { iconPath: "../icons/my_folder.svg" }
    schema.iconDefinitions.my_folder_xmas = { iconPath: "../icons/my_folder_xmas.svg" }
    schema.folderNamesExpanded["some/path"] = "my_folder"
    const result = applyXmasTheme(schema, ["my_folder"])
    expect(result.folderNamesExpanded["some/path"]).toBe("my_folder_xmas")
  })

  test("creates missing xmas definition dynamically", () => {
    const schema = emptySchema()
    schema.iconDefinitions.custom_folder = { iconPath: "../icons/custom_folder.svg" }
    schema.folderNamesExpanded["ns/path"] = "custom_folder"
    const result = applyXmasTheme(schema, ["custom_folder"])
    expect(result.iconDefinitions.custom_folder_xmas).toBeDefined()
    expect(result.iconDefinitions.custom_folder_xmas.iconPath).toBe("../icons/custom_folder_xmas.svg")
    expect(result.folderNamesExpanded["ns/path"]).toBe("custom_folder_xmas")
  })

  test("already-xmas names pass through unchanged regardless of whitelist", () => {
    const schema = emptySchema()
    schema.folderExpanded = "generic_folder_xmas"
    const result = applyXmasTheme(schema, [])
    expect(result.folderExpanded).toBe("generic_folder_xmas")
  })

  test("non-whitelisted icons in folder fields stay unchanged", () => {
    const schema = emptySchema()
    schema.iconDefinitions.not_xmas_folder = { iconPath: "../icons/not_xmas_folder.svg" }
    schema.folderNames["path"] = "not_xmas_folder"
    const result = applyXmasTheme(schema, ["other"])
    expect(result.folderNames["path"]).toBe("not_xmas_folder")
  })

  test("whitelist affects only matching folder entries", () => {
    const schema = emptySchema()
    schema.iconDefinitions.xmas_f = { iconPath: "../icons/xmas_f.svg" }
    schema.iconDefinitions.normal_f = { iconPath: "../icons/normal_f.svg" }
    schema.folderNamesExpanded["a"] = "xmas_f"
    schema.folderNamesExpanded["b"] = "normal_f"
    const result = applyXmasTheme(schema, ["xmas_f"])
    expect(result.folderNamesExpanded["a"]).toBe("xmas_f_xmas")
    expect(result.folderNamesExpanded["b"]).toBe("normal_f")
  })
})

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
