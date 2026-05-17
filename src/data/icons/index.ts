import type { IconDefinition } from "./types"
import type { IconName } from "../iconNames"
import { dataPackIcons } from "./dataPackIcons"
import { resourcePackIcons } from "./resourcePackIcons"
import { bedrockAddonIcons } from "./bedrockAddonIcons"
import { bedrockResourceIcons } from "./bedrockResourceIcons"
import { languageIcons } from "./languageIcons"
import { generalIcons } from "./generalIcons"

export type { IconDefinition }
export type { IconName }

export const icons: IconDefinition[] = [
  ...dataPackIcons,
  ...resourcePackIcons,
  ...bedrockAddonIcons,
  ...bedrockResourceIcons,
  ...languageIcons,
  ...generalIcons,
]
