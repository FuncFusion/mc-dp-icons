import * as vscode from "vscode"
import { config } from "../configuration/configManager"
import type { ConfigKey } from "../configuration/configManager"
import path from "path"

const keyPrefix = "mc-dp-icons."

function makeHandler(suffix: string) {
  const configKey = keyPrefix + suffix
  return (uri?: vscode.Uri) => {
    if (!uri) return

    const fsPath = uri.fsPath
    const shortenedPath = fsPath.split(path.sep).slice(-2).join(path.sep).replace(".mcfunction", "")
    const current = config.get(suffix as ConfigKey) as string[]
    const deduplicated = current.includes(shortenedPath) ? current : [...current, shortenedPath]
    config.changeWorkspace(configKey, deduplicated)
  }
}

const configSuffixes = [
  "tickFunctionNames",
  "loadFunctionNames",
  "crownedFunctions",
  "crownedTickFunctions",
  "crownedLoadFunctions",
]

const resetIcon = {
  id: "mc-dp-icons.resetIcon",
  handler: (uri?: vscode.Uri) => {
    if (!uri) {
      return
    }

    const fsPath = uri.fsPath
    const shortenedPath = fsPath.split(path.sep).slice(-2).join(path.sep).replace(".mcfunction", "")

    for (const suffix of configSuffixes) {
      const fullKey = keyPrefix + suffix
      const currentNames = config.get(suffix as ConfigKey) as string[]

      if (currentNames.includes(shortenedPath)) {
        const remainingNames = currentNames.filter(function(name) {
          return name !== shortenedPath
        })
        config.changeWorkspace(fullKey, remainingNames)
      }
    }
  }
}

export const commands = [
  {
    id: "mc-dp-icons.setTickIcon",
    handler: makeHandler("tickFunctionNames"),
  },
  {
    id: "mc-dp-icons.setLoadIcon",
    handler: makeHandler("loadFunctionNames"),
  },
  {
    id: "mc-dp-icons.setCrownedIcon",
    handler: makeHandler("crownedFunctions"),
  },
  {
    id: "mc-dp-icons.setCrownedTickIcon",
    handler: makeHandler("crownedTickFunctions"),
  },
  {
    id: "mc-dp-icons.setCrownedLoadIcon",
    handler: makeHandler("crownedLoadFunctions"),
  },
  resetIcon,
]
