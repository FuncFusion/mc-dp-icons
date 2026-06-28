import path from "path"
import { findManifestInWorkspace } from "./findManifest"

export async function getRootPaths(): Promise<string[]> {
  const manifestPaths = await findManifestInWorkspace()
  return manifestPaths.map(p => path.dirname(p))
}
