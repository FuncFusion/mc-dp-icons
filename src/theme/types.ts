export type DefinitionsMap = Record<string, { iconPath: string }>
export type FileNamesMap = Record<string, string>
export type FolderNamesMap = Record<string, string>

export interface ThemeSchema {
  iconDefinitions: DefinitionsMap
  file: string
  folder: string
  folderExpanded: string
  fileNames: FileNamesMap
  fileExtensions: Record<string, string>
  folderNames: FolderNamesMap
  folderNamesExpanded: FolderNamesMap
  hidesExplorerArrows: boolean
}
