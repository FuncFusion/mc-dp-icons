import { existsSync } from "fs"
import { mkdirSync, writeFileSync } from "fs"
import { dirname, resolve } from "path"
import { icons } from "../data/icons"
import { dataPackIcons } from "../data/icons/dataPackIcons"
import { resourcePackIcons } from "../data/icons/resourcePackIcons"
import { bedrockAddonIcons } from "../data/icons/bedrockAddonIcons"
import { bedrockResourceIcons } from "../data/icons/bedrockResourceIcons"
import { collectWorkspaceContributions } from "../themeScan/collectWorkspaceContributions"
import { createNodeFsPort } from "../themeScan/nodeFsPort"
import {
  applyChristmasTheme,
  buildBaseSchema,
  buildFolderAssociations,
  buildSubfolderIconMap,
  resolveVsCodeIconPath,
  scanXmasIcons,
} from "./themeGeneration/shared"
import {
  buildZedIconThemeFamily,
  mergeZedFileStems,
  mergeZedNamedDirectories,
} from "./themeGeneration/zedTheme"

function parseArgs(argv: string[]): { workspace?: string } {
  const workspaceIdx = argv.indexOf("--workspace")
  if (workspaceIdx === -1) {
    return {}
  }
  const workspace = argv[workspaceIdx + 1]
  if (!workspace) {
    throw new Error("--workspace requires a path argument")
  }
  return { workspace: resolve(workspace) }
}

function assertZedIconsLinked(repoRoot: string): void {
  const zedIcons = resolve(repoRoot, "zed", "icons")
  const marker = resolve(zedIcons, "generic_file.svg")
  if (!existsSync(marker)) {
    console.error(
      "zed/icons is missing or incomplete. Run:\n" +
        "  npm run zed:link-icons   (Windows)\n" +
        "  sh scripts/link-zed-icons.sh   (Unix)"
    )
    process.exit(1)
  }
}

async function main(): Promise<void> {
  const { workspace } = parseArgs(process.argv.slice(2))
  const repoRoot = resolve(__dirname, "..", "..")
  const iconsDir = resolve(repoRoot, "icons")
  const outputPath = resolve(repoRoot, "zed", "icon_themes", "mc-dp-icons.json")

  assertZedIconsLinked(repoRoot)

  const baseSchema = buildBaseSchema(icons, resolveVsCodeIconPath)
  const xmasNames = scanXmasIcons(iconsDir)
  const christmasSchema =
    xmasNames.length > 0 ? applyChristmasTheme(baseSchema, xmasNames) : undefined

  const family = buildZedIconThemeFamily(baseSchema, {
    familyName: "Datapack Icons",
    author: "FuncFusion",
    themeName: "Datapack Icons",
    christmasSchema,
    christmasThemeName: christmasSchema ? "Datapack Icons Christmas" : undefined,
  })

  const minecraftIcons = [
    ...dataPackIcons,
    ...resourcePackIcons,
    ...bedrockAddonIcons,
    ...bedrockResourceIcons,
  ]
  const mcFolderAssocs = buildFolderAssociations(minecraftIcons)
  const subfolderIconMap = buildSubfolderIconMap(
    baseSchema.iconDefinitions,
    mcFolderAssocs.folderNamesExpanded
  )

  if (workspace) {
    console.log(`Scanning workspace: ${workspace}`)
    const fs = createNodeFsPort([workspace])
    const contributions = await collectWorkspaceContributions({
      fs,
      subfolderIconMap,
      dynamicFunctionIcons: true,
      namespaceIcons: true,
      overlayIcons: true,
      subfolderIcons: true,
    })
    const primary = family.themes[0]
    mergeZedFileStems(primary, contributions.fileNames)
    if (contributions.folderNames) {
      mergeZedNamedDirectories(primary, contributions.folderNames)
    }
    console.log(
      `Merged ${Object.keys(contributions.fileNames).length} file stems, ` +
        `${Object.keys(contributions.folderNames ?? {}).length} named folders`
    )
  }

  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, JSON.stringify(family, null, 2) + "\n")
  console.log(
    `Generated Zed icon theme (${family.themes.length} variant(s)) → ${outputPath}`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
