import { readdirSync } from "fs"
import type { IconDefinition } from "../data/icons"
import type { ThemeSchema } from "../theme/types"

export function resolveVsCodeIconPath(iconName: string): string {
  return `../icons/${iconName}.svg`
}

export function isFileIcon(iconName: string): boolean {
  return iconName.includes("_file")
}

export function isFolderClosedIcon(iconName: string): boolean {
  return iconName.endsWith("_folder_closed")
}

export function isFolderIcon(iconName: string): boolean {
  if (iconName.endsWith("_folder") && iconName.endsWith("_folder_closed") === false) {
    return true
  }
  return false
}

export function buildIconDefinitions(
  iconDefinitions: IconDefinition[],
  resolvePath: (iconName: string) => string
): Record<string, { iconPath: string }> {
  const definitions: Record<string, { iconPath: string }> = {}
  for (const icon of iconDefinitions) {
    definitions[icon.name] = { iconPath: resolvePath(icon.name) }
  }
  return definitions
}

export function buildFileAssociations(
  iconDefinitions: IconDefinition[]
): {
  fileExtensions: Record<string, string>
  fileNames: Record<string, string>
} {
  const fileExtensions: Record<string, string> = {}
  const fileNames: Record<string, string> = {}
  for (const icon of iconDefinitions) {
    if (isFileIcon(icon.name) === false) continue
    if (icon.extensions) {
      for (const extension of icon.extensions) {
        fileExtensions[extension] = icon.name
      }
    }
    if (icon.filenames) {
      for (const fileName of icon.filenames) {
        fileNames[fileName] = icon.name
      }
    }
  }
  return {
    fileExtensions: fileExtensions,
    fileNames: fileNames,
  }
}

export function buildFolderAssociations(
  iconDefinitions: IconDefinition[]
): {
  folderNames: Record<string, string>
  folderNamesExpanded: Record<string, string>
} {
  const folderNames: Record<string, string> = {}
  const folderNamesExpanded: Record<string, string> = {}
  for (const icon of iconDefinitions) {
    if (icon.foldernames === undefined) continue
    if (isFolderClosedIcon(icon.name)) {
      for (const folderName of icon.foldernames) {
        folderNames[folderName] = icon.name
      }
      continue
    }
    if (isFolderIcon(icon.name)) {
      for (const folderName of icon.foldernames) {
        folderNamesExpanded[folderName] = icon.name
      }
    }
  }
  return {
    folderNames: folderNames,
    folderNamesExpanded: folderNamesExpanded,
  }
}

export function scanXmasIcons(iconsDir: string): string[] {
  const files = readdirSync(iconsDir)
  const names: string[] = []
  for (const file of files) {
    if (file.endsWith("_xmas.svg")) {
      names.push(file.replace("_xmas.svg", ""))
    }
  }
  return names
}

export function buildSubfolderIconMap(
  iconDefinitions: Record<string, { iconPath: string }>,
  folderNamesExpanded: Record<string, string>
): Record<string, string> {
  const map: Record<string, string> = {}
  for (const [folderName, iconName] of Object.entries(folderNamesExpanded)) {
    const fileIconName = iconName.replace(/_folder$/, "_file")
    if (fileIconName in iconDefinitions) {
      map[folderName] = fileIconName
    }
  }
  return map
}

export function applyXmasTheme(
  schema: ThemeSchema,
  xmasNames: string[],
  resolvePath: (iconName: string) => string
): ThemeSchema {
  const result = structuredClone(schema)
  for (const key of xmasNames) {
    if (key in result.iconDefinitions) {
      result.iconDefinitions[key] = {
        iconPath: resolvePath(`${key}_xmas`)
      }
    }
  }
  return result
}

export function buildBaseSchema(
  iconDefinitions: IconDefinition[],
  resolvePath: (iconName: string) => string
): ThemeSchema {
  const iconDefinitionsMap = buildIconDefinitions(iconDefinitions, resolvePath)
  const fileAssociations = buildFileAssociations(iconDefinitions)
  const folderAssociations = buildFolderAssociations(iconDefinitions)
  return {
    iconDefinitions: iconDefinitionsMap,
    file: "generic_file",
    folder: "generic_folder_closed",
    folderExpanded: "generic_folder",
    fileExtensions: fileAssociations.fileExtensions,
    fileNames: fileAssociations.fileNames,
    folderNames: folderAssociations.folderNames,
    folderNamesExpanded: folderAssociations.folderNamesExpanded,
    hidesExplorerArrows: false,
  }
}
