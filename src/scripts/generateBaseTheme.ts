import { mkdirSync, readdirSync, writeFileSync } from "fs"
import { dirname, resolve } from "path"
import { icons } from "../data/icons"
import { dataPackIcons } from "../data/icons/dataPackIcons"
import { resourcePackIcons } from "../data/icons/resourcePackIcons"
import { bedrockAddonIcons } from "../data/icons/bedrockAddonIcons"
import { bedrockResourceIcons } from "../data/icons/bedrockResourceIcons"
import type { IconDefinition } from "../data/icons"
import type { ThemeSchema } from "../theme/types"

function resolveIconPath(iconName: string): string {
  return `../icons/${iconName}.svg`
}

function isFileIcon(iconName: string): boolean {
  return iconName.includes("_file")
}

function isFolderClosedIcon(iconName: string): boolean {
  return iconName.endsWith("_folder_closed")
}

function isFolderIcon(iconName: string): boolean {
  if (iconName.endsWith("_folder") && iconName.endsWith("_folder_closed") === false) {
    return true
  }
  return false
}

function buildIconDefinitions(
  iconDefinitions: IconDefinition[]
): Record<string, { iconPath: string }> {

  const definitions: Record<string, { iconPath: string }> = {}

  for (const icon of iconDefinitions) {
    definitions[icon.name] = { iconPath: resolveIconPath(icon.name) }
  }

  return definitions
}

function buildFileAssociations(
  iconDefinitions: IconDefinition[]
): {
  fileExtensions: Record<string, string>
  fileNames: Record<string, string>
} {

  const fileExtensions: Record<string, string> = {}
  const fileNames: Record<string, string> = {}

  for (const icon of iconDefinitions) {
    if (isFileIcon(icon.name) === false) {
      continue
    }

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

function buildFolderAssociations(
  iconDefinitions: IconDefinition[]
): {
  folderNames: Record<string, string>
  folderNamesExpanded: Record<string, string>
} {

  const folderNames: Record<string, string> = {}
  const folderNamesExpanded: Record<string, string> = {}

  for (const icon of iconDefinitions) {
    if (icon.foldernames === undefined) {
      continue
    }

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

function scanXmasIcons(): string[] {
  const iconsDir = resolve(__dirname, "..", "..", "icons")
  const files = readdirSync(iconsDir)
  const names: string[] = []
  for (const file of files) {
    if (file.endsWith("_xmas.svg")) {
      names.push(file.replace("_xmas.svg", ""))
    }
  }
  return names
}

function buildSubfolderIconMap(
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

function buildBaseSchema(
  iconDefinitions: IconDefinition[]
): ThemeSchema {

  const iconDefinitionsMap = buildIconDefinitions(iconDefinitions)
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

function writeOutput(
  schema: ThemeSchema,
  outputFilePath: string
): void {

  mkdirSync(dirname(outputFilePath), { recursive: true })

  const minecraftIcons = [
    ...dataPackIcons, ...resourcePackIcons,
    ...bedrockAddonIcons, ...bedrockResourceIcons,
  ]
  const mcFolderAssocs = buildFolderAssociations(minecraftIcons)
  const subfolderIconMap = buildSubfolderIconMap(schema.iconDefinitions, mcFolderAssocs.folderNamesExpanded)
  const xmasIcons = scanXmasIcons()

  const serialized = JSON.stringify(schema, null, 2)
  const subfolderSerialized = JSON.stringify(subfolderIconMap, null, 2)
  const xmasSerialized = JSON.stringify(xmasIcons, null, 2)
  const content =
    "// GENERATED — do not edit manually\n" +
    "// Run: npx tsx src/scripts/generateBaseTheme.ts\n" +
    `import type { ThemeSchema } from "../theme/types"\n` +
    `import type { IconName } from "./icons/types"\n` +
    "\n" +
    `export const baseTheme: ThemeSchema = ${serialized}\n` +
    "\n" +
    `export const subfolderIconMap: Record<string, IconName> = ${subfolderSerialized}\n` +
    "\n" +
    `export const xmasIcons: IconName[] = ${xmasSerialized}\n`

  writeFileSync(outputFilePath, content)
}

const outputFilePath = resolve(__dirname, "..", "..", "src", "data", "baseTheme.ts")
const schema = buildBaseSchema(icons)
writeOutput(schema, outputFilePath)
console.log(`Generated base theme with ${Object.keys(schema.iconDefinitions).length} icons → ${outputFilePath}`)
