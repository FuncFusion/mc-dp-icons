import * as vscode from "vscode"
import { getConfig, changeWorkspaceConfig } from "../configuration/configManager"
import type { ConfigKey } from "../configuration/configManager"
import path from "path"

const keyPrefix = "mc-dp-icons."

function resetShortenedPath(shortenedPath: string) {
  for (const suffix of configSuffixes) {
    const currentNames = getConfig(suffix as ConfigKey) as string[]

    if (currentNames.includes(shortenedPath)) {
      const remainingNames = currentNames.filter(function(name) {
        return name !== shortenedPath
      })
      changeWorkspaceConfig(keyPrefix + suffix, remainingNames)
    }
  }
}

function makeHandler(suffix: string) {
  const configKey = keyPrefix + suffix
  return (uri?: vscode.Uri) => {
    if (!uri) {
      return
    }

    const fsPath = uri.fsPath
    const shortenedPath = fsPath.split(path.sep).slice(-2).join("/").replace(".mcfunction", "")
    resetShortenedPath(shortenedPath)
    changeWorkspaceConfig(configKey, [shortenedPath])
  }
}

const configSuffixes = [
  "tickFunctionNames",
  "loadFunctionNames",
  "crownedFunctionsNames",
  "crownedTickFunctionsNames",
  "crownedLoadFunctionsNames",
]

const resetIcon = {
  id: "mc-dp-icons.resetIcon",
  handler: (uri?: vscode.Uri) => {
    if (!uri) {
      return
    }

    const fsPath = uri.fsPath
    const shortenedPath = fsPath.split(path.sep).slice(-2).join("/").replace(".mcfunction", "")

    resetShortenedPath(shortenedPath)
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
    handler: makeHandler("crownedFunctionsNames"),
  },
  {
    id: "mc-dp-icons.setCrownedTickIcon",
    handler: makeHandler("crownedTickFunctionsNames"),
  },
  {
    id: "mc-dp-icons.setCrownedLoadIcon",
    handler: makeHandler("crownedLoadFunctionsNames"),
  },
  resetIcon,
]
