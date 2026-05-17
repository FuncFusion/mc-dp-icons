import { workspace, Uri } from "vscode"
import { dirname } from "path"
import { getConfig } from "../configuration/configManager"
import type { FileNamesMap, FolderNamesMap, ThemeSchema } from "./types"

const noChristmasVersion = [
  "data_folder", "src_folder", "overlay_folder", "assets_folder",
  "data_folder_closed", "src_folder_closed", "overlay_folder_closed", "assets_folder_closed"
]

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
      this.applyChristmasIcons()
    }
    return structuredClone(this.theme)
  }

  private isChristmas(): boolean {
    const setting = getConfig("christmasIcons")
    if (setting === "Never") return false
    if (setting === "Always") return true
    return new Date().getMonth() === 11
  }

  private makeXmasIcon(iconName: string): string {
    const xmasKey = iconName + "_xmas"

    if (xmasKey in this.theme.iconDefinitions) return xmasKey

    const original = this.theme.iconDefinitions[iconName]

    if (noChristmasVersion.includes(iconName)) {
      return iconName
    }

    this.theme.iconDefinitions[xmasKey] = {
      iconPath: original.iconPath.replace(".svg", "_xmas.svg"),
    }
    return xmasKey
  }

  private applyChristmasIcons(): void {
    this.theme.folder = this.makeXmasIcon(this.theme.folder)
    this.theme.folderExpanded = this.makeXmasIcon(this.theme.folderExpanded)

    for (const [folderPath, iconName] of Object.entries(this.theme.folderNames)) {
      this.theme.folderNames[folderPath] = this.makeXmasIcon(iconName)
    }
    for (const [folderPath, iconName] of Object.entries(this.theme.folderNamesExpanded)) {
      this.theme.folderNamesExpanded[folderPath] = this.makeXmasIcon(iconName)
    }
  }
}
