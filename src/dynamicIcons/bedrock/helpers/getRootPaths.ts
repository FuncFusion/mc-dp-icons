import { findManifestInWorkspace } from "./findManifest"

export async function getRootPaths(): Promise<string[]> {
  const manifestPaths = await findManifestInWorkspace()
  const packPaths = manifestPaths.map(p => p.replace("manifest.json", ""))

  if (!packPaths) return []
  return packPaths
}
