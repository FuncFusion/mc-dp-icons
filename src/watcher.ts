import * as vscode from "vscode"
import { workspace } from "vscode"

function isRelevantFile(event: vscode.Uri): boolean {
  const name = event.fsPath.split('/').pop() || ''
  return (name === "pack.mcmeta" || name.endsWith(".json")) && name !== "settings.json"
}

export function createFileWatcher(onChange: () => void) {
  const UPDATE_INTERVAL = 50
  let timer: NodeJS.Timeout | undefined

  const debounce = () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      onChange()
      timer = undefined
    }, UPDATE_INTERVAL)
  }

  const subscriptions = [
    workspace.onDidChangeWorkspaceFolders(() => debounce()),
    workspace.onDidRenameFiles(() => debounce()),
    workspace.onDidDeleteFiles(event => {
      if (isRelevantFile(event.files[0])) debounce()
    }),
    workspace.onDidCreateFiles(event => {
      if (isRelevantFile(event.files[0])) debounce()
    }),
    workspace.onDidSaveTextDocument(document => {
      if (isRelevantFile(document.uri)) debounce()
    }),
    workspace.onDidChangeConfiguration(() => debounce()),
  ]

  return { debounce, subscriptions }
}
