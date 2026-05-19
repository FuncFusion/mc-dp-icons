# Zed support

Datapack Icons ships a [Zed icon theme extension](https://zed.dev/docs/extensions/icon-themes) under [`zed/`](../zed/).

## Dynamic icons vs VS Code

| Feature | VS Code extension | Zed |
| --- | --- | --- |
| Runtime theme updates | Yes (`icon_theme/active.json`) | No — static JSON only |
| tick/load from `tick.json` / tags | Automatic | `npm run generate:zed-theme -- --workspace <path>` then reload |
| Namespace / overlay folders | Automatic | Same workspace command |
| Subfolder JSON icons | Automatic | Same (uses generated `subfolderIconMap`) |
| Crowned functions / settings | VS Code settings | Not ported (no Zed settings API) |
| Workspace theme switching | Yes | No |
| Christmas variants | Setting | Second theme: **Datapack Icons Christmas** |

Zed extensions cannot assign per-file icons at runtime. Workspace-aware mappings are produced by [`src/themeScan/`](../src/themeScan/) — the same module VS Code uses via `collectWorkspaceContributions`.

`zed/icon_themes/mc-dp-icons.json` is **not** in git; run `npm run generate` (or `generate:zed-theme`) before using the dev extension.

## Local install (no marketplace)

1. Generate themes and link icons:

   ```bash
   npm run generate
   npm run zed:link-icons
   ```

   On Linux/macOS use `sh scripts/link-zed-icons.sh` instead of `zed:link-icons`.

2. Optional — merge icons for a Minecraft workspace:

   ```bash
   npx tsx src/scripts/generateZedTheme.ts --workspace "C:/path/to/your/datapack"
   ```

   (`npm run` reserves `--workspace`; use `npx tsx` for the flag.)

3. In Zed: **Extensions** → **Install Dev Extension** → select the `zed/` folder.

4. Command palette → **icon theme selector: toggle** → **Datapack Icons**.

After editing `zed/icon_themes/mc-dp-icons.json`, save the file; recent Zed builds reload icon themes automatically. Otherwise toggle the theme again.

## Regenerating

```bash
npm run generate:zed-theme
```

Output: `zed/icon_themes/mc-dp-icons.json` (generated locally).

## Publishing (later)

Submit a PR to [zed-industries/extensions](https://github.com/zed-industries/extensions) pointing at this repo’s `zed/` directory once local validation is done.

Source SVGs live in [`icons/`](../icons/). Design sources: [mc-dp-icons-assets](https://github.com/FuncFusion/mc-dp-icons-assets).
