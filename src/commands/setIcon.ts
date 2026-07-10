import * as vscode from "vscode"
import { getConfig, changeWorkspaceConfig } from "../configuration/configManager"
import type { ConfigKey } from "../configuration/configManager"

const keyPrefix = "mc-dp-icons."

const configSuffixes = [
  "tickFunctionNames",
  "loadFunctionNames",
  "crownedFunctionsNames",
  "crownedTickFunctionsNames",
  "crownedLoadFunctionsNames",
]

function removeFromAllLists(shortenedPath: string): [string, string[]][] {
  const updates: [string, string[]][] = []
  for (const suffix of configSuffixes) {
    const currentNames = getConfig(suffix as ConfigKey) as string[]
    if (currentNames.includes(shortenedPath)) {
      updates.push([keyPrefix + suffix, currentNames.filter(function(name) {
        return name !== shortenedPath
      })])
    }
  }
  return updates
}

function makeHandler(suffix: string) {
  const configKey = keyPrefix + suffix
  return (uri?: vscode.Uri) => {
    if (!uri) {
      return
    }

    const shortenedPath = uri.path.split("/").slice(-2).join("/").replace(".mcfunction", "")

    const updates = removeFromAllLists(shortenedPath)

    const currentTarget = getConfig(suffix as ConfigKey) as string[]
    if (!currentTarget.includes(shortenedPath)) {
      updates.push([configKey, [...currentTarget, shortenedPath]])
    }

    for (const [key, val] of updates) {
      changeWorkspaceConfig(key, val)
    }
  }
}

const resetIcon = {
  id: "mc-dp-icons.resetIcon",
  handler: (uri?: vscode.Uri) => {
    if (!uri) {
      return
    }

    const shortenedPath = uri.path.split("/").slice(-2).join("/").replace(".mcfunction", "")

    const updates = removeFromAllLists(shortenedPath)
    for (const [key, val] of updates) {
      changeWorkspaceConfig(key, val)
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
