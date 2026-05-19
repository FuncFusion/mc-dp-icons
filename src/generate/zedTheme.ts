import { mkdirSync, writeFileSync } from "fs"
import { dirname, resolve } from "path"
import { icons } from "../data/icons"
import type { ThemeSchema } from "../theme/types"
import {
  applyXmasTheme,
  buildBaseSchema,
  resolveVsCodeIconPath,
  scanXmasIcons,
} from "./utils"

export interface ZedIconTheme {
  name: string
  appearance: string
  directory_icons: {
    collapsed: string
    expanded: string
  }
  named_directory_icons: Record<string, { collapsed: string; expanded: string }>
  file_stems: Record<string, string>
  file_suffixes: Record<string, string>
  file_icons: Record<string, { path: string }>
}

export interface ZedIconThemeFamily {
  $schema: string
  name: string
  author: string
  themes: ZedIconTheme[]
}

export function isZedFileIcon(iconName: string): boolean {
  return iconName.includes("_file")
}

export function convertVsCodePath(vsCodePath: string): string {
  return vsCodePath.replace("../", "./")
}

function buildNamedDirectoryIcons(
  schema: ThemeSchema
): Record<string, { collapsed: string; expanded: string }> {
  const defaultClosedDef = schema.iconDefinitions[schema.folder]
  const defaultClosedPath = defaultClosedDef !== undefined ? convertVsCodePath(defaultClosedDef.iconPath) : ""
  const icons: Record<string, { collapsed: string; expanded: string }> = {}
  for (const [folderName, iconName] of Object.entries(schema.folderNamesExpanded)) {
    const def = schema.iconDefinitions[iconName]
    if (def === undefined) continue
    icons[folderName] = {
      collapsed: defaultClosedPath,
      expanded: convertVsCodePath(def.iconPath),
    }
  }
  for (const [folderName, iconName] of Object.entries(schema.folderNames)) {
    const def = schema.iconDefinitions[iconName]
    if (def === undefined) continue
    if (icons[folderName] === undefined) {
      icons[folderName] = {
        collapsed: convertVsCodePath(def.iconPath),
        expanded: "",
      }
    } else {
      icons[folderName].collapsed = convertVsCodePath(def.iconPath)
    }
  }
  return icons
}

function buildFileIcons(
  schema: ThemeSchema,
  iconFilter?: (iconName: string) => boolean
): Record<string, { path: string }> {
  const icons: Record<string, { path: string }> = {}
  for (const [iconName, iconDef] of Object.entries(schema.iconDefinitions)) {
    if (iconFilter !== undefined && iconFilter(iconName) === false) continue
    if (iconDef === undefined) continue
    icons[iconName] = { path: convertVsCodePath(iconDef.iconPath) }
  }
  const defaultDef = schema.iconDefinitions[schema.file]
  if (defaultDef !== undefined) {
    icons.default = { path: convertVsCodePath(defaultDef.iconPath) }
  }
  return icons
}

function themeSchemaToZed(
  schema: ThemeSchema,
  themeName: string,
  iconFilter?: (iconName: string) => boolean
): ZedIconTheme {
  const closedDef = schema.iconDefinitions[schema.folder]
  const expandedDef = schema.iconDefinitions[schema.folderExpanded]
  return {
    name: themeName,
    appearance: "dark",
    directory_icons: {
      collapsed: closedDef !== undefined ? convertVsCodePath(closedDef.iconPath) : "",
      expanded: expandedDef !== undefined ? convertVsCodePath(expandedDef.iconPath) : "",
    },
    named_directory_icons: buildNamedDirectoryIcons(schema),
    file_stems: schema.fileNames,
    file_suffixes: schema.fileExtensions,
    file_icons: buildFileIcons(schema, iconFilter),
  }
}

function buildZedIconThemeFamily(
  baseSchema: ThemeSchema,
  options: {
    themeName?: string
    author?: string
    xmasSchema?: ThemeSchema
  }
): ZedIconThemeFamily {
  const themeName = options.themeName || "Datapack Icons"
  const author = options.author || "funcfusion"
  const themes: ZedIconTheme[] = [
    themeSchemaToZed(baseSchema, themeName, isZedFileIcon),
  ]
  if (options.xmasSchema !== undefined) {
    themes.push(
      themeSchemaToZed(options.xmasSchema, `${themeName} (Christmas)`, isZedFileIcon)
    )
  }
  return {
    $schema: "https://zed.dev/schema/icon_themes/v0.3.0.json",
    name: themeName,
    author: author,
    themes: themes,
  }
}

export function generateZedTheme(): void {
  const outputFilePath = resolve(__dirname, "..", "..", "zed", "icon_themes", "mc-dp-icons.json")

  const baseSchema = buildBaseSchema(icons, resolveVsCodeIconPath)
  const xmasIcons = scanXmasIcons(resolve(__dirname, "..", "..", "icons"))
  const xmasSchema = applyXmasTheme(baseSchema, xmasIcons, resolveVsCodeIconPath)

  const themeFamily = buildZedIconThemeFamily(baseSchema, {
    themeName: "Datapack Icons",
    author: "funcfusion",
    xmasSchema: xmasSchema,
  })

  mkdirSync(dirname(outputFilePath), { recursive: true })
  writeFileSync(outputFilePath, JSON.stringify(themeFamily, null, 2))

  console.log(`Generated Zed icon theme with ${Object.keys(baseSchema.iconDefinitions).length} icons → ${outputFilePath}`)
  if (xmasIcons.length > 0) {
    console.log(`  Includes Christmas variant (${xmasIcons.length} icons)`)
  }
}
