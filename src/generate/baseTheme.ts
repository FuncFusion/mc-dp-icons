import { mkdirSync, writeFileSync } from "fs"
import { dirname, resolve } from "path"
import { icons } from "../data/icons"
import { dataPackIcons } from "../data/icons/dataPackIcons"
import { resourcePackIcons } from "../data/icons/resourcePackIcons"
import { bedrockAddonIcons } from "../data/icons/bedrockAddonIcons"
import { bedrockResourceIcons } from "../data/icons/bedrockResourceIcons"
import {
  buildBaseSchema,
  buildFolderAssociations,
  buildSubfolderIconMap,
  resolveVsCodeIconPath,
  scanXmasIcons,
} from "./utils"

function writeOutput(
  schema: ReturnType<typeof buildBaseSchema>,
  outputFilePath: string
): void {

  mkdirSync(dirname(outputFilePath), { recursive: true })

  const minecraftIcons = [
    ...dataPackIcons, ...resourcePackIcons,
    ...bedrockAddonIcons, ...bedrockResourceIcons,
  ]
  const mcFolderAssocs = buildFolderAssociations(minecraftIcons)
  const subfolderIconMap = buildSubfolderIconMap(schema.iconDefinitions, mcFolderAssocs.folderNamesExpanded)
  const xmasIcons = scanXmasIcons(resolve(__dirname, "..", "..", "icons"))

  const serialized = JSON.stringify(schema, null, 2)
  const subfolderSerialized = JSON.stringify(subfolderIconMap, null, 2)
  const xmasSerialized = JSON.stringify(xmasIcons, null, 2)
  const content =
    "// GENERATED — do not edit manually\n" +
    "// Run: bun src/generate/index.ts\n" +
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

export function generateBaseTheme(): void {
  const schema = buildBaseSchema(icons, resolveVsCodeIconPath)
  writeOutput(schema, resolve(__dirname, "..", "..", "src", "data", "baseTheme.ts"))

  const activePath = resolve(__dirname, "..", "..", "icon_theme", "active.json")
  writeFileSync(activePath, JSON.stringify(schema, null, 2))
}
