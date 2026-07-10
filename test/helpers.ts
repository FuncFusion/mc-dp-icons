import { URI } from "vscode-uri"

export const mockVscodeState = {
  configStore: {} as Record<string, unknown>,
  tagContents: {} as Record<string, string>,
  showWarningMessage: undefined as unknown,
  showErrorMessage: undefined as unknown,
  lastWrittenPath: "" as string,
  lastWrittenContent: "" as string,
  createdDirPaths: [] as string[],
  existingPaths: new Set<string>(),
  readDirectoryResult: undefined as
    | ((dirPath: string) => Array<[string, number]>)
    | undefined,
  findFilesResult: undefined as
    | ((include: string) => Array<{ fsPath: string; path: string }>)
    | undefined,
  workspaceFoldersResult: undefined as Array<{ uri: { fsPath: string } }> | undefined,
  eventListeners: {} as Record<string, (arg?: unknown) => void>,
}

function makeEvent<T>(eventName: string) {
  return {
    event: (listener: (e: T) => unknown) => {
      mockVscodeState.eventListeners[eventName] = listener as (arg?: unknown) => void
      return { dispose: () => {} }
    },
    fire: (arg: T) => {
      const listener = mockVscodeState.eventListeners[eventName]
      if (listener) {
        listener(arg as unknown)
      }
    },
  }
}

export function resetMockState(): void {
  mockVscodeState.configStore = {}
  mockVscodeState.tagContents = {}
  mockVscodeState.showWarningMessage = undefined
  mockVscodeState.showErrorMessage = undefined
  mockVscodeState.lastWrittenPath = ""
  mockVscodeState.lastWrittenContent = ""
  mockVscodeState.createdDirPaths = []
  mockVscodeState.existingPaths = new Set()
  mockVscodeState.readDirectoryResult = undefined
  mockVscodeState.findFilesResult = undefined
  mockVscodeState.workspaceFoldersResult = undefined
  mockVscodeState.eventListeners = {}
}

export function createMockVscode() {
  return {
    workspace: {
      getConfiguration: () => ({
        get: (key: string, defaultVal: unknown) =>
          key in mockVscodeState.configStore
            ? mockVscodeState.configStore[key]
            : defaultVal,
        update: async () => {},
        inspect: <T>(key: string) => {
          const value = mockVscodeState.configStore[key] as T | undefined
          return {
            key,
            globalValue: value,
            workspaceValue: undefined,
            workspaceFolderValue: undefined,
            defaultValue: undefined,
          }
        },
      }),
      onDidChangeWorkspaceFolders: makeEvent("onDidChangeWorkspaceFolders").event,
      onDidCreateFiles: makeEvent("onDidCreateFiles").event,
      onDidDeleteFiles: makeEvent("onDidDeleteFiles").event,
      onDidRenameFiles: makeEvent("onDidRenameFiles").event,
      onDidSaveTextDocument: makeEvent("onDidSaveTextDocument").event,
      onDidChangeConfiguration: makeEvent("onDidChangeConfiguration").event,
      fs: {
        createDirectory: async (uri: { path: string }) => {
          mockVscodeState.createdDirPaths.push(uri.path)
        },
        writeFile: async (uri: { path: string }, content: Uint8Array) => {
          mockVscodeState.lastWrittenPath = uri.path
          mockVscodeState.lastWrittenContent = new TextDecoder().decode(content)
        },
        readFile: async (uri: { path: string }) => {
          const content = mockVscodeState.tagContents[uri.path]
          if (content) {
            return new TextEncoder().encode(content)
          }
          const err = new Error("ENOENT") as Error & { code: string }
          err.code = "ENOENT"
          throw err
        },
        readDirectory: async (uri: { path: string }) => {
          if (mockVscodeState.readDirectoryResult) {
            return mockVscodeState.readDirectoryResult(uri.path)
          }
          return []
        },
        stat: async (uri: { path: string }) => {
          if (mockVscodeState.existingPaths.has(uri.path)) {
            return { type: 2, ctime: 0, mtime: 0, size: 0 }
          }
          const err = new Error("ENOENT") as Error & { code: string }
          err.code = "ENOENT"
          throw err
        },
      },
      findFiles: async (include: string) => {
        if (mockVscodeState.findFilesResult) {
          return mockVscodeState.findFilesResult(include)
        }
        return []
      },
      get workspaceFolders() { return mockVscodeState.workspaceFoldersResult },
    },
    window: {
      createOutputChannel: () => ({
        appendLine: () => {},
      }),
      showWarningMessage: async (msg: string) => {
        mockVscodeState.showWarningMessage = msg
      },
      showErrorMessage: async (msg: string) => {
        mockVscodeState.showErrorMessage = msg
      },
    },
    Uri: {
      file: (p: string) => {
        const realUri = URI.file(p)
        return {
          get fsPath() { return realUri.fsPath },
          get path() { return realUri.path },
          get scheme() { return realUri.scheme },
          get authority() { return realUri.authority },
          with: (changes: { path?: string }) => realUri.with(changes),
        }
      },
    },
    FileType: { File: 1, Directory: 2 },
    ConfigurationTarget: { Global: 1, Workspace: 2 },
    EventEmitter: class {
      event = () => {}
      fire = () => {}
    },
  }
}
