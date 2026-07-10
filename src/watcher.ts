import * as vscode from "vscode"
import { workspace } from "vscode"
import { Utils } from "vscode-uri"

function isRelevantUri(uri: vscode.Uri): boolean {
  const name = Utils.basename(uri)
  return (
    (name === "pack.mcmeta" || name.endsWith(".json") || name === "beet.yaml" || name === "beet.yml") &&
    name !== "settings.json"
  ) || uri.path.endsWith("/")
}

function hasRelevantFile(event: vscode.FileCreateEvent | vscode.FileDeleteEvent): boolean {
  return event.files.some(file => isRelevantUri(file))
}

export function createFileWatcher(onChange: () => void) {
  const UPDATE_INTERVAL = 50
  let timer: NodeJS.Timeout | undefined

  const debounce = () => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      onChange()
      timer = undefined
    }, UPDATE_INTERVAL)
  }

  const subscriptions = [
    workspace.onDidChangeWorkspaceFolders(() => debounce()),
    workspace.onDidRenameFiles(() => debounce()),
    workspace.onDidDeleteFiles(event => {
      if (hasRelevantFile(event)) {
        debounce()
      }
    }),
    workspace.onDidCreateFiles(event => {
      if (hasRelevantFile(event)) {
        debounce()
      }
    }),
    workspace.onDidSaveTextDocument(document => {
      if (isRelevantUri(document.uri)) {
        debounce()
      }
    }),
    workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration("mc-dp-icons")) {
        debounce()
      }
    }),
  ]

  return { debounce, subscriptions }
}
