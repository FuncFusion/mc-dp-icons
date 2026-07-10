import { workspace, ConfigurationTarget } from "vscode"

type ChristmasOption = 'Only on Christmas' | 'Always' | 'Never'

const defaults = {
  workspaceDetection: false,
  dynamicFunctionIcons: true,
  loadFunctionNames: [] as string[],
  tickFunctionNames: [] as string[],
  crownedFunctionsNames: [] as string[],
  crownedTickFunctionsNames: [] as string[],
  crownedLoadFunctionsNames: [] as string[],
  subfolderIcons: true,
  namespaceIcons: true,
  overlayIcons: true,
  christmasIcons: 'Only on Christmas' as ChristmasOption,
  hideFolderArrows: false,
  fallbackIconTheme: '',
  debug: false,
  tooManyFilesWarningDismissed: false,
} as const

export type ConfigKey = keyof typeof defaults

export function getConfig<Key extends ConfigKey>(name: Key): (typeof defaults)[Key] {
  return workspace.getConfiguration().get<(typeof defaults)[Key]>(`mc-dp-icons.${name}`, defaults[name])
}

export function changeGlobalConfig(key: string, value: unknown): Thenable<void> {
  return workspace.getConfiguration().update(key, value, ConfigurationTarget.Global)
}

export function changeWorkspaceConfig(key: string, value: unknown): Thenable<void> {
  return workspace.getConfiguration().update(key, value, ConfigurationTarget.Workspace)
}
