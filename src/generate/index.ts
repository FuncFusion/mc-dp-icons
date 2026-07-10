import { writeFileSync } from "fs"
import { join } from "path"
import { generateIconNames } from "./iconNames"
import { generateBaseTheme } from "./baseTheme"
import { baseTheme } from "../data/baseTheme"

generateIconNames()
generateBaseTheme()

const activePath = join(__dirname, "../../icon_theme/active.json")
writeFileSync(activePath, JSON.stringify(baseTheme, null, 2))
