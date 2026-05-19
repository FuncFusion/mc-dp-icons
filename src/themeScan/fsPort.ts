export interface DirEntry {
  name: string
  isDirectory: boolean
}

export interface FileSystemPort {
  readonly roots: string[]
  pathExists(path: string): Promise<boolean>
  readDirectory(path: string): Promise<DirEntry[]>
  readTextFile(path: string): Promise<string>
  /** Workspace-relative glob; returns absolute paths. */
  findFiles(relativePattern: string): Promise<string[]>
}
