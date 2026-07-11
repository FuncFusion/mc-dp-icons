/// <reference types="bun-types" />
import { mock, describe, test, expect, beforeAll, beforeEach } from "bun:test"
import { mockVscodeState, createMockVscode, resetMockState } from "./helpers"

mock.module("vscode", createMockVscode)

let createFileWatcher: (onChange: () => void) => { debounce: () => void; subscriptions: { dispose: () => void }[] }
let fireEvent: (eventName: string, arg?: unknown) => void

beforeAll(async () => {
  const mod = await import("../src/watcher")
  createFileWatcher = mod.createFileWatcher
  fireEvent = (name, arg) => {
    const listener = mockVscodeState.eventListeners[name]
    if (listener) listener(arg)
  }
})

beforeEach(() => {
  resetMockState()
})

describe("createFileWatcher", () => {
  test("returns subscriptions array", () => {
    const watcher = createFileWatcher(() => {})
    expect(watcher.subscriptions.length).toBe(6)
    for (const sub of watcher.subscriptions) {
      expect(typeof sub.dispose).toBe("function")
    }
  })

  test("workspace folder change triggers onChange", async () => {
    let called = false
    createFileWatcher(() => { called = true })
    fireEvent("onDidChangeWorkspaceFolders")
    await new Promise(r => setTimeout(r, 60))
    expect(called).toBe(true)
  })

  test("file create triggers onChange for pack.mcmeta", async () => {
    let called = false
    createFileWatcher(() => { called = true })
    fireEvent("onDidCreateFiles", { files: [{ path: "/dp/pack.mcmeta", fsPath: "/dp/pack.mcmeta" }] })
    await new Promise(r => setTimeout(r, 60))
    expect(called).toBe(true)
  })

  test("file create ignored for irrelevant files", async () => {
    let called = false
    createFileWatcher(() => { called = true })
    fireEvent("onDidCreateFiles", { files: [{ path: "/readme.txt", fsPath: "/readme.txt" }] })
    await new Promise(r => setTimeout(r, 60))
    expect(called).toBe(false)
  })

  test("file create triggers for tags/functions/ JSON files", async () => {
    let called = false
    createFileWatcher(() => { called = true })
    fireEvent("onDidCreateFiles", { files: [{ path: "/dp/data/minecraft/tags/functions/tick.json", fsPath: "/dp/data/minecraft/tags/functions/tick.json" }] })
    await new Promise(r => setTimeout(r, 60))
    expect(called).toBe(true)
  })

  test("file delete triggers onChange for relevant files", async () => {
    let called = false
    createFileWatcher(() => { called = true })
    fireEvent("onDidDeleteFiles", { files: [{ path: "/dp/pack.mcmeta", fsPath: "/dp/pack.mcmeta" }] })
    await new Promise(r => setTimeout(r, 60))
    expect(called).toBe(true)
  })

  test("config change triggers onChange for mc-dp-icons", async () => {
    let called = false
    createFileWatcher(() => { called = true })
    fireEvent("onDidChangeConfiguration", { affectsConfiguration: (id: string) => id === "mc-dp-icons" })
    await new Promise(r => setTimeout(r, 60))
    expect(called).toBe(true)
  })

  test("config change does NOT trigger for other settings", async () => {
    let called = false
    createFileWatcher(() => { called = true })
    fireEvent("onDidChangeConfiguration", { affectsConfiguration: (id: string) => id === "other.extension" })
    await new Promise(r => setTimeout(r, 60))
    expect(called).toBe(false)
  })

  test("save triggers onChange for pack.mcmeta", async () => {
    let called = false
    createFileWatcher(() => { called = true })
    fireEvent("onDidSaveTextDocument", { uri: { path: "/dp/pack.mcmeta", fsPath: "/dp/pack.mcmeta" } })
    await new Promise(r => setTimeout(r, 60))
    expect(called).toBe(true)
  })

  test("save for settings.json does NOT trigger onChange", async () => {
    let called = false
    createFileWatcher(() => { called = true })
    fireEvent("onDidSaveTextDocument", { uri: { path: "/.vscode/settings.json", fsPath: "/.vscode/settings.json" } })
    await new Promise(r => setTimeout(r, 60))
    expect(called).toBe(false)
  })

  test("save ignored for non-relevant files", async () => {
    let called = false
    createFileWatcher(() => { called = true })
    fireEvent("onDidSaveTextDocument", { uri: { path: "/readme.txt", fsPath: "/readme.txt" } })
    await new Promise(r => setTimeout(r, 60))
    expect(called).toBe(false)
  })

  test("debounce coalesces multiple rapid triggers", async () => {
    let count = 0
    createFileWatcher(() => { count++ })
    fireEvent("onDidCreateFiles", { files: [{ path: "/dp/tags/functions/tick.json", fsPath: "/dp/tags/functions/tick.json" }] })
    fireEvent("onDidCreateFiles", { files: [{ path: "/dp/tags/functions/load.json", fsPath: "/dp/tags/functions/load.json" }] })
    fireEvent("onDidCreateFiles", { files: [{ path: "/dp/tags/functions/test.json", fsPath: "/dp/tags/functions/test.json" }] })
    await new Promise(r => setTimeout(r, 60))
    expect(count).toBe(1)
  })

})
