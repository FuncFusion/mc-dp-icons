import * as vscode from "vscode"
import { getConfig } from "../../configuration/configManager"
import type { ConfigKey } from "../../configuration/configManager"
import { filterSegmentDepth, processList } from "../utils"

type SpecialIcon = {
  key: ConfigKey
  icon: string
}

const specialIcons: SpecialIcon[] = [
  { key: "loadFunctionNames", icon: "mcfunction_load_file" },
  { key: "tickFunctionNames", icon: "mcfunction_tick_file" },
  { key: "crownedFunctionsNames", icon: "mcfunction_file_crowned" },
  { key: "crownedLoadFunctionsNames", icon: "mcfunction_load_file_crowned" },
  { key: "crownedTickFunctionsNames", icon: "mcfunction_tick_file_crowned" },
]

export async function getUserFileNames(): Promise<Record<string, string>> {
  const allRawNames: string[][] = specialIcons.map(function(entry) {
    return getConfig(entry.key) as string[]
  })

  const flatNames = allRawNames.flat()
  const seen = new Map<string, string>()
  let conflictName = ""
  const hasConflict = flatNames.some(function(name) {
    if (seen.has(name)) {
      conflictName = name
      return true
    }
    seen.set(name, "")
    return false
  })

  if (hasConflict) {
    vscode.window.showWarningMessage(
      'Duplicate icon assignment: "' + conflictName + '". Can only assign one special icon per file.'
    )
    return {}
  }

  const processedArrays = await Promise.all(
    allRawNames.map(function(names) {
      return processList(names)
    })
  )

  const invalidEntries: string[] = []
  const validArrays = processedArrays.map(function(arr) {
    const { valid, invalid } = filterSegmentDepth(arr)
    invalidEntries.push(...invalid)
    return valid
  })

  if (invalidEntries.length > 0) {
    vscode.window.showErrorMessage(
      "Ignored " + invalidEntries.length + " icon path(s) with more than 2 segments. " +
      "VS Code icon themes only support up to 2 path segments."
    )
  }

  const fileNames: Record<string, string> = {}

  function assignIcon(names: string[], icon: string) {
    for (const name of names) {
      fileNames[name] = icon
    }
  }

  for (let i = 0; i < specialIcons.length; i++) {
    assignIcon(validArrays[i], specialIcons[i].icon)
  }

  return fileNames
}
