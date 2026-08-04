import { subfolderReference } from "./helpers/subfolderReference"
import { getSubFolderFiles as collect } from "../utils"

export async function getSubFolderFiles(): Promise<Record<string, string>> {
  const scan = async () => {
    return subfolderReference()
  }
  return collect(scan)
}
