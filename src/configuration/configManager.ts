import { workspace, ConfigurationTarget } from "vscode"

type ChristmasOption = 'Only on Christmas' | 'Always' | 'Never'

const defaults = {
  workspaceDetection: false,
  dynamicFunctionIcons: true,
  loadFunctionNames: [] as string[],
  tickFunctionNames: [] as string[],
  crownedFunctions: [] as string[],
  crownedTickFunctions: [] as string[],
  crownedLoadFunctions: [] as string[],
  subfolderIcons: true,
  namespaceIcons: true,
  overlayIcons: true,
  christmasIcons: 'Only on Christmas' as ChristmasOption,
  hideFolderArrows: false,
  fallbackIconTheme: '',
  debug: false,
} as const

type ConfigKey = keyof typeof defaults

class ConfigManager {
  private config = workspace.getConfiguration()

  get<Key extends ConfigKey>(name: Key): (typeof defaults)[Key] {
    return this.config.get<(typeof defaults)[Key]>(`mc-dp-icons.${name}`, defaults[name])
  }

  changeGlobal(key: string, value: any): void {
    this.config.update(key, value, ConfigurationTarget.Global)
  }

  changeWorkspace(key: string, value: any): void {
    this.config.update(key, value, ConfigurationTarget.Workspace)
  }
}

export const config = new ConfigManager()
