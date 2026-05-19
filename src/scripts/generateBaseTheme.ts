import { mkdirSync, writeFileSync } from "fs"
import { dirname, resolve } from "path"
import { icons } from "../data/icons"
import { dataPackIcons } from "../data/icons/dataPackIcons"
import { resourcePackIcons } from "../data/icons/resourcePackIcons"
import { bedrockAddonIcons } from "../data/icons/bedrockAddonIcons"
import { bedrockResourceIcons } from "../data/icons/bedrockResourceIcons"
import type { ThemeSchema } from "../theme/types"
import {
  buildBaseSchema,
  buildFolderAssociations,
  buildSubfolderIconMap,
  resolveVsCodeIconPath,
  scanXmasIcons,
} from "./themeGeneration/shared"

function writeOutput(schema: ThemeSchema, outputFilePath: string): void {
  mkdirSync(dirname(outputFilePath), { recursive: true })

  const minecraftIcons = [
    ...dataPackIcons,
    ...resourcePackIcons,
    ...bedrockAddonIcons,
    ...bedrockResourceIcons,
  ]
  const mcFolderAssocs = buildFolderAssociations(minecraftIcons)
  const subfolderIconMap = buildSubfolderIconMap(
    schema.iconDefinitions,
    mcFolderAssocs.folderNamesExpanded
  )
  const iconsDir = resolve(__dirname, "..", "..", "icons")
  const xmasIcons = scanXmasIcons(iconsDir)

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
const schema = buildBaseSchema(icons, resolveVsCodeIconPath)
writeOutput(schema, outputFilePath)
console.log(
  `Generated base theme with ${Object.keys(schema.iconDefinitions).length} icons → ${outputFilePath}`
)
