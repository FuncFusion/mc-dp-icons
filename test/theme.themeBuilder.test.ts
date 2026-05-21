/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll } from "bun:test"
import { mockVscodeState, createMockVscode } from "./helpers"
import type { ThemeSchema } from "../src/theme/types"

mock.module("vscode", createMockVscode)

type TBClass = import("../src/theme/themeBuilder").ThemeBuilder
let ThemeBuilder: new (base: ThemeSchema) => TBClass

function schema(): ThemeSchema {
  return {
    iconDefinitions: {
      generic_file: { iconPath: "../icons/generic_file.svg" },
      generic_folder: { iconPath: "../icons/generic_folder.svg" },
      generic_folder_closed: { iconPath: "../icons/generic_folder_closed.svg" },
    },
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

beforeAll(async () => {
  mockVscodeState.configStore["mc-dp-icons.christmasIcons"] = "Never"
  const mod = await import("../src/theme/themeBuilder")
  ThemeBuilder = mod.ThemeBuilder
})

describe("ThemeBuilder", () => {
  test("build returns a clone, does not mutate the base", () => {
    const base = schema()
    const builder = new ThemeBuilder(base)
    builder.addFileNames({ "test.mcfunction": "mcfunction_file" })
    const result = builder.build()
    expect(result.fileNames["test.mcfunction"]).toBe("mcfunction_file")
    expect(base.fileNames["test.mcfunction"]).toBeUndefined()
  })

  test("addFolders auto-resolves _closed variant when definition exists", () => {
    const base = schema()
    base.iconDefinitions["my_folder_closed"] = { iconPath: "a.svg" }
    const builder = new ThemeBuilder(base)
    builder.addFolders({ "mydir": "my_folder" })
    const result = builder.build()
    expect(result.folderNamesExpanded["mydir"]).toBe("my_folder")
    expect(result.folderNames["mydir"]).toBe("my_folder_closed")
  })

  test("addFolders does not set closed variant when definition is missing", () => {
    const base = schema()
    const builder = new ThemeBuilder(base)
    builder.addFolders({ "mydir": "my_folder" })
    const result = builder.build()
    expect(result.folderNamesExpanded["mydir"]).toBe("my_folder")
    expect(result.folderNames["mydir"]).toBeUndefined()
  })
})
