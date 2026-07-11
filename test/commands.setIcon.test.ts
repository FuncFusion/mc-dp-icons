/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll, beforeEach } from "bun:test"
import { mockVscodeState, createMockVscode, resetMockState } from "./helpers"

mock.module("vscode", createMockVscode)

let commands: { id: string; handler: (uri?: { path: string }) => Promise<void> }[]

beforeAll(async () => {
  const mod = await import("../src/commands/setIcon")
  commands = mod.commands
})

beforeEach(() => {
  resetMockState()
})

function mockUri(path: string) {
  return { path, fsPath: path, scheme: "file", authority: "", with: () => mockUri(path) }
}

describe("setIcon commands", () => {
  test.each([
    ["setTickIcon", "mc-dp-icons.tickFunctionNames"],
    ["setLoadIcon", "mc-dp-icons.loadFunctionNames"],
    ["setCrownedIcon", "mc-dp-icons.crownedFunctionsNames"],
    ["setCrownedTickIcon", "mc-dp-icons.crownedTickFunctionsNames"],
    ["setCrownedLoadIcon", "mc-dp-icons.crownedLoadFunctionsNames"],
  ])("%s handler adds path to its config", async (id, configKey) => {
    const cmd = commands.find((c) => c.id === "mc-dp-icons." + id)
    expect(cmd).toBeDefined()
    await cmd!.handler(mockUri("/dp/data/minecraft/functions/main.mcfunction"))
    expect(mockVscodeState.configStore[configKey]).toEqual(["functions/main"])
  })

  test("handler with no URI is no-op", async () => {
    const cmd = commands.find((c) => c.id === "mc-dp-icons.setTickIcon")
    await cmd!.handler(undefined)
    expect(Object.keys(mockVscodeState.configStore).length).toBe(0)
  })

  test("handler removes path from other configs when adding", async () => {
    mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"] = ["functions/main"]
    const cmd = commands.find((c) => c.id === "mc-dp-icons.setLoadIcon")
    await cmd!.handler(mockUri("/dp/data/minecraft/functions/main.mcfunction"))
    expect(mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"]).toEqual([])
    expect(mockVscodeState.configStore["mc-dp-icons.loadFunctionNames"]).toEqual(["functions/main"])
  })

  test("handler removes path when already in target (toggle behavior)", async () => {
    mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"] = ["functions/main"]
    const cmd = commands.find((c) => c.id === "mc-dp-icons.setTickIcon")
    await cmd!.handler(mockUri("/dp/data/minecraft/functions/main.mcfunction"))
    expect(mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"]).toEqual([])
  })

  test("resetIcon handler removes path from all configs", async () => {
    mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"] = ["functions/main"]
    mockVscodeState.configStore["mc-dp-icons.loadFunctionNames"] = ["functions/main"]
    mockVscodeState.configStore["mc-dp-icons.crownedFunctionsNames"] = ["functions/other"]
    const cmd = commands.find((c) => c.id === "mc-dp-icons.resetIcon")
    await cmd!.handler(mockUri("/dp/data/minecraft/functions/main.mcfunction"))
    expect(mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"]).toEqual([])
    expect(mockVscodeState.configStore["mc-dp-icons.loadFunctionNames"]).toEqual([])
    expect(mockVscodeState.configStore["mc-dp-icons.crownedFunctionsNames"]).toEqual(["functions/other"])
  })

  test("resetIcon with no URI is no-op", async () => {
    mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"] = ["functions/main"]
    const cmd = commands.find((c) => c.id === "mc-dp-icons.resetIcon")
    await cmd!.handler(undefined)
    expect(mockVscodeState.configStore["mc-dp-icons.tickFunctionNames"]).toEqual(["functions/main"])
  })
})
