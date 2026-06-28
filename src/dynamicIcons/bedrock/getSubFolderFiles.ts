import { subfolderReference } from "./helpers/subfolderReference"
import { getSubFolderFiles as collect } from "../utils"

export const getSubFolderFiles = (): Promise<Record<string, string>> => collect(subfolderReference)
