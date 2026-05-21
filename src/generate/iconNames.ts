import { readdirSync, writeFileSync } from "fs"
import { resolve } from "path"

export function generateIconNames(): void {
  const iconsDir = resolve(__dirname, "..", "..", "icons")
  const names = readdirSync(iconsDir)
    .filter((f) => {
      if (!f.endsWith(".svg")) {
        return false
      }
      const name = f.slice(0, -4)
      return !name.endsWith("_xmas")
    })
    .map((f) => f.slice(0, -4))
    .sort()

  const output = `// GENERATED — do not edit manually
// Run: bun src/generate/index.ts

export type IconName = ${names.map((n) => `"${n}"`).join(" | ")}

export const iconNames: IconName[] = [
  ${names.map((n) => `"${n}"`).join(",\n  ")},
]
`

  const outPath = resolve(__dirname, "..", "..", "src", "data", "iconNames.ts")
  writeFileSync(outPath, output)
  console.log(`Generated ${names.length} icon names → src/data/iconNames.ts`)
}
