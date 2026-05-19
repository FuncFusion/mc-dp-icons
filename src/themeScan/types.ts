import type { FileSystemPort } from "./fsPort"

export interface ThemeContributions {
  fileNames: Record<string, string>
  folderNames?: Record<string, string>
}

export interface CollectOptions {
  fs: FileSystemPort
  subfolderIconMap?: Record<string, string>
  dynamicFunctionIcons?: boolean
  namespaceIcons?: boolean
  overlayIcons?: boolean
  subfolderIcons?: boolean
  loadFunctionNames?: string[]
  tickFunctionNames?: string[]
  crownedFunctions?: string[]
  crownedLoadFunctions?: string[]
  crownedTickFunctions?: string[]
  /** Called when subfolder scan exceeds threshold (VS Code warning). */
  onSubfolderFileCount?: (count: number) => void
  /** Called when load and tick custom name lists overlap (VS Code warning). */
  onLoadTickNamingConflict?: () => void
}
