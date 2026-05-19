import type { ThemeSchema } from "../../theme/types"
import { resolveZedIconPath } from "./shared"

export interface ZedDirectoryIcons {
  collapsed: string
  expanded: string
}

export interface ZedIconTheme {
  name: string
  appearance: "dark"
  directory_icons: ZedDirectoryIcons
  named_directory_icons: Record<string, ZedDirectoryIcons>
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

const ZED_SCHEMA = "https://zed.dev/schema/icon_themes/v0.3.0.json"

export function themeSchemaToZed(
  schema: ThemeSchema,
  themeName: string
): ZedIconTheme {
  const file_icons: Record<string, { path: string }> = {}
  for (const iconName of Object.keys(schema.iconDefinitions)) {
    file_icons[iconName] = { path: resolveZedIconPath(iconName) }
  }

  const named_directory_icons: Record<string, ZedDirectoryIcons> = {}
  const allFolderKeys = new Set([
    ...Object.keys(schema.folderNames),
    ...Object.keys(schema.folderNamesExpanded),
  ])

  for (const folderKey of allFolderKeys) {
    const collapsedIcon =
      schema.folderNames[folderKey] ?? schema.folderNamesExpanded[folderKey] ?? schema.folder
    const expandedIcon =
      schema.folderNamesExpanded[folderKey] ?? schema.folderNames[folderKey] ?? schema.folderExpanded

    named_directory_icons[folderKey] = {
      collapsed: resolveZedIconPath(collapsedIcon),
      expanded: resolveZedIconPath(expandedIcon),
    }

    const basename = folderKey.split("/").pop()
    if (basename && basename !== folderKey && !(basename in named_directory_icons)) {
      named_directory_icons[basename] = named_directory_icons[folderKey]
    }
  }

  return {
    name: themeName,
    appearance: "dark",
    directory_icons: {
      collapsed: resolveZedIconPath(schema.folder),
      expanded: resolveZedIconPath(schema.folderExpanded),
    },
    named_directory_icons,
    file_stems: { ...schema.fileNames },
    file_suffixes: { ...schema.fileExtensions },
    file_icons: {
      ...file_icons,
      default: { path: resolveZedIconPath(schema.file) },
    },
  }
}

export function buildZedIconThemeFamily(
  baseSchema: ThemeSchema,
  options: {
    familyName: string
    author: string
    themeName: string
    christmasSchema?: ThemeSchema
    christmasThemeName?: string
  }
): ZedIconThemeFamily {
  const themes: ZedIconTheme[] = [
    themeSchemaToZed(baseSchema, options.themeName),
  ]

  if (options.christmasSchema && options.christmasThemeName) {
    themes.push(themeSchemaToZed(options.christmasSchema, options.christmasThemeName))
  }

  return {
    $schema: ZED_SCHEMA,
    name: options.familyName,
    author: options.author,
    themes,
  }
}

export function mergeZedFileStems(
  theme: ZedIconTheme,
  extra: Record<string, string>
): void {
  Object.assign(theme.file_stems, extra)
}

export function folderIconNamePair(iconName: string): { collapsed: string; expanded: string } {
  if (iconName.endsWith("_folder_closed")) {
    return {
      collapsed: iconName,
      expanded: iconName.replace(/_folder_closed$/, "_folder"),
    }
  }
  if (iconName.endsWith("_folder")) {
    return {
      collapsed: iconName.replace(/_folder$/, "_folder_closed"),
      expanded: iconName,
    }
  }
  return { collapsed: iconName, expanded: iconName }
}

export function mergeZedNamedDirectories(
  theme: ZedIconTheme,
  folderNames: Record<string, string>
): void {
  for (const [folderKey, iconName] of Object.entries(folderNames)) {
    const { collapsed, expanded } = folderIconNamePair(iconName)
    const dirs: ZedDirectoryIcons = {
      collapsed: resolveZedIconPath(
        collapsed in theme.file_icons ? collapsed : iconName
      ),
      expanded: resolveZedIconPath(
        expanded in theme.file_icons ? expanded : iconName
      ),
    }
    theme.named_directory_icons[folderKey] = dirs

    const base = folderKey.split("/").pop()
    if (base && base !== folderKey) {
      theme.named_directory_icons[base] = dirs
    }
  }
}
