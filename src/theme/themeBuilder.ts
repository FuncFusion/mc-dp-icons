import { workspace, Uri } from "vscode"
import { dirname } from "path"
import { getConfig } from "../configuration/configManager"
import { xmasIcons } from "../data/baseTheme"
import { applyXmasTheme } from "../generate/utils"
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
      if (folder in this.theme.folderNamesExpanded || folder in this.theme.folderNames) {
        continue
      }

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

  async write(outputPath: string): Promise<void> {
    const theme = this.build()
    const dirUri = Uri.file(dirname(outputPath))
    await workspace.fs.createDirectory(dirUri)
    const content = JSON.stringify(theme, null, 2)
    const encodedContent = new TextEncoder().encode(content)
    await workspace.fs.writeFile(Uri.file(outputPath), encodedContent)
  }

  build(): ThemeSchema {
    if (this.isChristmas()) {
      return applyXmasTheme(this.theme, xmasIcons)
    }
    return structuredClone(this.theme)
  }

  private isChristmas(): boolean {
    const setting = getConfig("christmasIcons")
    if (setting === "Never") {
      return false
    }
    if (setting === "Always") {
      return true
    }
    const now = new Date()
    return now.getMonth() === 11 && now.getDate() >= 24 && now.getDate() <= 26
  }
}
