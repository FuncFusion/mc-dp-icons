import { getConfig } from "../configuration/configManager"
import type { CollectOptions } from "./types"
import type { FileSystemPort } from "./fsPort"

export function buildCollectOptionsFromVscodeConfig(
  fs: FileSystemPort,
  subfolderIconMap: Record<string, string>,
  callbacks?: {
    onSubfolderFileCount?: (count: number) => void
    onLoadTickNamingConflict?: () => void
  }
): CollectOptions {
  return {
    fs,
    subfolderIconMap,
    dynamicFunctionIcons: getConfig("dynamicFunctionIcons"),
    namespaceIcons: getConfig("namespaceIcons"),
    overlayIcons: getConfig("overlayIcons"),
    subfolderIcons: getConfig("subfolderIcons"),
    loadFunctionNames: getConfig("loadFunctionNames") ?? [],
    tickFunctionNames: getConfig("tickFunctionNames") ?? [],
    crownedFunctions: getConfig("crownedFunctions") ?? [],
    crownedLoadFunctions: getConfig("crownedLoadFunctions") ?? [],
    crownedTickFunctions: getConfig("crownedTickFunctions") ?? [],
    onSubfolderFileCount: callbacks?.onSubfolderFileCount,
    onLoadTickNamingConflict: callbacks?.onLoadTickNamingConflict,
  }
}
