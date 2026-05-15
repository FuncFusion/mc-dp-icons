import { config } from "../configuration/configManager"

const prefix = "[mc-dp-icons]"

export const logger = {
  debug(...args: unknown[]) {
    if (!config.get("debug")) return
    console.info(prefix, ...args)
  },
  error(error: unknown, context?: string) {
    const msg = context ? `${prefix} ${context}:` : prefix
    console.error(msg, error)
  },
}
