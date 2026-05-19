import { findBedrockPackRoots, findPackMcmetaDirs } from "./nodeFsPort"
import { collectCrownedFunctions } from "./collectors/crowned"
import { collectBedrockTick, collectJavaLoadTick } from "./collectors/loadTick"
import { collectNamespaceFolders } from "./collectors/namespaces"
import { collectOverlayFolders } from "./collectors/overlays"
import {
  collectBedrockSubfolderFiles,
  collectJavaSubfolderFiles,
} from "./collectors/subfolders"
import type { CollectOptions, ThemeContributions } from "./types"

const SUBFOLDER_WARN_THRESHOLD = 2000

function mergeContributions(
  target: ThemeContributions,
  patch: ThemeContributions
): void {
  Object.assign(target.fileNames, patch.fileNames)
  if (patch.folderNames) {
    target.folderNames ??= {}
    Object.assign(target.folderNames, patch.folderNames)
  }
}

export async function collectWorkspaceContributions(
  options: CollectOptions
): Promise<ThemeContributions> {
  const result: ThemeContributions = { fileNames: {}, folderNames: {} }
  const fs = options.fs

  const packPaths = await findPackMcmetaDirs(fs)
  const bedrockRoots = await findBedrockPackRoots(fs)

  if (packPaths.length > 0) {
    const loadTick = await collectJavaLoadTick(fs, {
      dynamicFunctionIcons: options.dynamicFunctionIcons ?? true,
      loadFunctionNames: options.loadFunctionNames ?? [],
      tickFunctionNames: options.tickFunctionNames ?? [],
      onLoadTickNamingConflict: options.onLoadTickNamingConflict,
    })
    Object.assign(result.fileNames, loadTick)

    const crowned = await collectCrownedFunctions(fs, {
      crownedFunctions: options.crownedFunctions ?? [],
      crownedLoadFunctions: options.crownedLoadFunctions ?? [],
      crownedTickFunctions: options.crownedTickFunctions ?? [],
    })
    Object.assign(result.fileNames, crowned)

    if (options.namespaceIcons !== false) {
      mergeContributions(result, {
        fileNames: {},
        folderNames: await collectNamespaceFolders(packPaths, fs),
      })
    }

    if (options.overlayIcons !== false) {
      mergeContributions(result, {
        fileNames: {},
        folderNames: await collectOverlayFolders(packPaths, fs),
      })
    }

    if (options.subfolderIcons !== false && options.subfolderIconMap) {
      const { fileNames, totalFiles } = await collectJavaSubfolderFiles(
        packPaths,
        fs,
        options.subfolderIconMap
      )
      Object.assign(result.fileNames, fileNames)
      if (totalFiles >= SUBFOLDER_WARN_THRESHOLD) {
        options.onSubfolderFileCount?.(totalFiles)
      }
    }
  }

  if (bedrockRoots.length > 0) {
    const tick = await collectBedrockTick(fs, {
      dynamicFunctionIcons: options.dynamicFunctionIcons ?? true,
      tickFunctionNames: options.tickFunctionNames ?? [],
    })
    Object.assign(result.fileNames, tick)

    if (options.subfolderIcons !== false && options.subfolderIconMap) {
      const { fileNames, totalFiles } = await collectBedrockSubfolderFiles(
        bedrockRoots,
        fs,
        options.subfolderIconMap
      )
      Object.assign(result.fileNames, fileNames)
      if (totalFiles >= SUBFOLDER_WARN_THRESHOLD) {
        options.onSubfolderFileCount?.(totalFiles)
      }
    }
  }

  if (result.folderNames && Object.keys(result.folderNames).length === 0) {
    delete result.folderNames
  }

  return result
}
