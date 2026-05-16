export interface ThemeContributions {
  fileNames: Record<string, string>
  folderNames?: Record<string, string>
}

export interface ThemeModule {
  name: string
  guard(): Promise<boolean>
  collect(): Promise<ThemeContributions>
}
