export const mockVscodeState = {
  configStore: {} as Record<string, unknown>,
  tagContents: {} as Record<string, string>,
  showWarningMessage: undefined as unknown,
  lastWrittenPath: "" as string,
  lastWrittenContent: "" as string,
  createdDirPaths: [] as string[],
  existingPaths: new Set<string>(),
  readDirectoryResult: undefined as
    | ((dirPath: string) => Array<[string, number]>)
    | undefined,
  findFilesResult: undefined as
    | ((include: string) => Array<{ fsPath: string }>)
    | undefined,
  workspaceFoldersResult: undefined as Array<{ uri: { fsPath: string } }> | undefined,
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
      }),
      fs: {
        createDirectory: async (uri: { fsPath: string }) => {
          mockVscodeState.createdDirPaths.push(uri.fsPath)
        },
        writeFile: async (uri: { fsPath: string }, content: Uint8Array) => {
          mockVscodeState.lastWrittenPath = uri.fsPath
          mockVscodeState.lastWrittenContent = new TextDecoder().decode(content)
        },
        readFile: async (uri: { fsPath: string }) => {
          const content = mockVscodeState.tagContents[uri.fsPath]
          if (content) {
            return new TextEncoder().encode(content)
          }
          return new Uint8Array()
        },
        readDirectory: async (uri: { fsPath: string }) => {
          if (mockVscodeState.readDirectoryResult) {
            return mockVscodeState.readDirectoryResult(uri.fsPath)
          }
          return []
        },
        stat: async (uri: { fsPath: string }) => {
          if (mockVscodeState.existingPaths.has(uri.fsPath)) {
            return {}
          }
          throw new Error("ENOENT")
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
      showWarningMessage: async (msg: string) => {
        mockVscodeState.showWarningMessage = msg
      },
    },
    Uri: {
      file: (p: string) => {
        const wrap = (path: string) => ({
          fsPath: path,
          scheme: "file",
          path,
          authority: "",
          with: (changes: { path?: string }) => wrap(changes.path ?? path),
        })
        return wrap(p.startsWith("/") ? p : "/" + p)
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
