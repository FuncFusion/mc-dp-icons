import path from "path"
import { findManifestInWorkspace } from "./findManifest"

export async function getRootPaths(): Promise<string[]> {
  const manifestPaths = await findManifestInWorkspace()
  const packPaths = manifestPaths.map(p => path.dirname(p))

  if (!packPaths) {
    return []
  }
  return packPaths
}
