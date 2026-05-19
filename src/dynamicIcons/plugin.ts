export type { ThemeContributions } from "../themeScan"

/** @deprecated Theme modules replaced by themeScan; kept for compatibility. */
export interface ThemeModule {
  name: string
  guard(): Promise<boolean>
  collect(): Promise<import("../themeScan").ThemeContributions>
}
