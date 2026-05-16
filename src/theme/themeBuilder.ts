import { mkdirSync, writeFileSync } from "fs"
import { dirname } from "path"
import type { FileNamesMap, FolderNamesMap, ThemeSchema } from "./types"

export class ThemeBuilder {
  private theme: ThemeSchema

  constructor(base: ThemeSchema) {
    this.theme = structuredClone(base)
  }

  addFileNames(entries: FileNamesMap): void {
    Object.assign(this.theme.fileNames, entries)
  }

  addFolders(entries: FolderNamesMap): void {
    for (const [folder, iconName] of Object.entries(entries)) {
      this.theme.folderNamesExpanded[folder] = iconName

      const closedIcon = iconName + "_closed"

      if (closedIcon in this.theme.iconDefinitions) {
        this.theme.folderNames[folder] = closedIcon
      }
    }
  }

  setHidesExplorerArrows(value: boolean): void {
    this.theme.hidesExplorerArrows = value
  }

  write(outputPath: string): void {
    mkdirSync(dirname(outputPath), { recursive: true })
    const content = JSON.stringify(this.theme, null, 2)
    writeFileSync(outputPath, content, "utf-8")
  }

  build(): ThemeSchema {
    return structuredClone(this.theme)
  }
}
