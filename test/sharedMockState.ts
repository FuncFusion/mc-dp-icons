export const mockState: {
  configStore: Record<string, unknown>
  tagContents: Record<string, string>
  showWarningMessage: unknown
  getConfigResult: (key: string) => unknown
} = {
  configStore: {},
  tagContents: {},
  showWarningMessage: undefined,
  getConfigResult: (key: string) =>
    "mc-dp-icons." + key in mockState.configStore
      ? mockState.configStore["mc-dp-icons." + key]
      : undefined,
}
