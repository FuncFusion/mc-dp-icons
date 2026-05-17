import type { IconDefinition } from "./types"

export const bedrockAddonIcons: IconDefinition[] = [
  {
    name: "blocks_file",
    extensions: ["blocks/json"],
  },
  {
    name: "blocks_folder",
    foldernames: ["blocks", "blocktypelist"],
  },
  {
    name: "entities_file",
    extensions: ["entities/json", "entity/json"],
  },
  {
    name: "entities_folder",
    foldernames: ["entities", "entity", "characters"],
  },
  {
    name: "features_file",
    extensions: ["feature_rules/json", "features/json"],
  },
  {
    name: "features_folder",
    foldernames: ["feature_rules", "features", "prefablist", "prefabs"],
  },
  {
    name: "spawn_rules_file",
    extensions: ["spawn_rules/json"],
  },
  {
    name: "spawn_rules_folder",
    foldernames: ["spawn_rules"],
  },
  {
    name: "trading_file",
    extensions: ["trade_set/json", "villager_trade/json", "trading/json"],
  },
  {
    name: "trading_folder",
    foldernames: ["trade_set", "villager_trade", "trading", "bartershops", "npc"],
  },
]
