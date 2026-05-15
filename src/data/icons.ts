import type { IconName } from "./iconNames"

export interface IconDefinition {
  name: IconName
  extensions?: string[]
  filenames?: string[]
  foldernames?: string[]
}

export const icons: IconDefinition[] = [
  {
    name: "advancement_file",
    extensions: ["advancement/json", "advancements/json"],
  },
  {
    name: "advancement_folder",
    foldernames: ["advancement", "advancements"],
  },
  {
    name: "ajmeta_file",
    extensions: ["ajblueprint", "ajmeta", "ajmodel"],
  },
  {
    name: "android_file",
    extensions: ["aab", "aar", "apk", "apks", "axml", "dalvik", "dex", "smali"],
  },
  {
    name: "ant_file",
    extensions: ["ant"],
    filenames: ["ant.xml", "build.xml"],
  },
  {
    name: "archive_file",
    extensions: ["mcaddon", "mceditoraddon", "mcpack", "mcproject", "mctemplate", "mcworld", "7z", "ace", "arj", "asar", "bak", "br", "bz2", "bzip2", "cab", "gz", "gzip", "iso", "lz4", "lzma", "pak", "rar", "rpm", "squashfs", "sublime-package", "tar", "tgz", "txz", "tz", "vhd", "xz", "zip", "zst"],
  },
  {
    name: "archive_folder",
    foldernames: ["archive", "archived", "archives", "lib", "libs", "packages", "pkg"],
  },
  {
    name: "arduino_file",
    extensions: ["ino"],
  },
  {
    name: "aseprite_file",
    extensions: ["ase", "aseprite"],
  },
  {
    name: "assembly_file",
    extensions: ["a51", "armasm", "asm", "gas", "hla", "mips", "mitigus", "nasm", "s", "yasm"],
  },
  {
    name: "assets_folder",
    foldernames: ["assets"],
  },
  {
    name: "assets_folder_closed",
    foldernames: ["assets"],
  },
  {
    name: "atlases_file",
    extensions: ["atlases/json"],
    filenames: ["atlases/blocks.json", "textures/terrain_texture.json"],
  },
  {
    name: "atlases_folder",
    foldernames: ["atlases"],
  },
  {
    name: "attachables_file",
    extensions: ["attachables/json"],
  },
  {
    name: "attachables_folder",
    foldernames: ["attachables"],
  },
  {
    name: "audio_file",
    extensions: ["ogg", "fsb", "aac", "ac3", "aif", "aiff", "amr", "ape", "au", "dts", "f4a", "f4b", "flac", "gsm", "m4a", "m4b", "m4p", "mid", "midi", "mka", "mod", "mp2", "mp3", "mpc", "oga", "opus", "pda", "ra", "spx", "wav", "wma", "wv"],
  },
  {
    name: "audio_folder",
    foldernames: ["sounds", "audio"],
  },
  {
    name: "autohotkey_file",
    extensions: ["ahk"],
  },
  {
    name: "banner_pattern_file",
    extensions: ["banner_pattern/json"],
  },
  {
    name: "banner_pattern_folder",
    foldernames: ["banner_pattern"],
  },
  {
    name: "beet_file",
    filenames: ["beet.json", "beet.yaml", "beet.yml"],
  },
  {
    name: "binary_file",
    extensions: ["a", "bin", "blob", "bson", "dll", "dylib", "hex", "jsxbin", "lib", "o", "res", "scn", "sys"],
  },
  {
    name: "biomes_client.json_file",
    filenames: ["biomes_client.json", "client_biome.json"],
  },
  {
    name: "blazor_file",
    extensions: ["cshtml", "razor"],
  },
  {
    name: "block_culling_file",
    extensions: ["block_culling/json"],
  },
  {
    name: "block_culling_folder",
    foldernames: ["block_culling"],
  },
  {
    name: "blockbench_file",
    extensions: ["bbmodel"],
  },
  {
    name: "blocks.json_file",
    filenames: ["blocks.json"],
  },
  {
    name: "blocks_file",
    extensions: ["blocks/json"],
  },
  {
    name: "blocks_folder",
    foldernames: ["blocks", "blocktypelist"],
  },
  {
    name: "blockstates_file",
    extensions: ["blockstates/json"],
  },
  {
    name: "blockstates_folder",
    foldernames: ["blockstates"],
  },
  {
    name: "bolt_file",
    extensions: ["bolt"],
  },
  {
    name: "brainfuck_file",
    extensions: ["b", "bf", "bfk", "brainfuck", "brfk"],
  },
  {
    name: "bukkit_file",
    filenames: ["bukkit.yaml", "bukkit.yml", "plugin.yaml", "plugin.yml"],
  },
  {
    name: "c_file",
    extensions: ["c", "h", "i", "objc"],
  },
  {
    name: "cargo_file",
    filenames: [".cargo/config.toml", "Cargo.toml"],
  },
  {
    name: "cargo_folder",
    foldernames: [".cargo", "crates"],
  },
  {
    name: "cat_variant_file",
    extensions: ["cat_variant/json"],
  },
  {
    name: "cat_variant_folder",
    foldernames: ["cat_sound_variant", "cat_variant"],
  },
  {
    name: "chat_type_file",
    extensions: ["chat_type/json", "dialogue/json"],
  },
  {
    name: "chat_type_folder",
    foldernames: ["chat_type", "dialogue"],
  },
  {
    name: "chicken_variant_file",
    extensions: ["chicken_variant/json"],
  },
  {
    name: "chicken_variant_folder",
    foldernames: ["chicken_sound_variant", "chicken_variant"],
  },
  {
    name: "clojure_file",
    extensions: ["clj", "cljc", "cljd", "cljr", "cljs"],
  },
  {
    name: "config_file",
    extensions: ["cfg", "cnf", "conf", "conf.dist", "config", "config.js", "config.ts", "dist", "env", "env.development", "env.example", "env.local", "env.production", "htaccess", "import", "ini", "ini.dist", "properties", "settings"],
    filenames: [".eslintrc", ".eslintrc.json", ".eslintrc.yaml", ".eslintrc.yml", ".hintrc", ".hintrc.json", ".hintrc.yaml", ".hintrc.yml", ".mcattributes", ".mcdefinitions", "appsettings.json", "conf", "config", "config.json", "settings.json", "webpack.config.cjs", "webpack.config.js", "webpack.config.mjs", "webpack.config.ts"],
  },
  {
    name: "config_folder",
    foldernames: ["ci", "config", "configs", "etc", "gameplayconfigs", "helpers", "prefabeditorcreationsettings", "projectileconfigs", "settings", "util", "utilities", "utils"],
  },
  {
    name: "contributing_file",
    filenames: ["CONTRIBUTING", "CONTRIBUTING.md", "CONTRIBUTING.txt"],
  },
  {
    name: "copyright_file",
    filenames: ["COPYRIGHT", "COPYRIGHT.md", "COPYRIGHT.txt"],
  },
  {
    name: "cow_variant_file",
    extensions: ["cow_variant/json"],
  },
  {
    name: "cow_variant_folder",
    foldernames: ["cow_sound_variant", "cow_variant"],
  },
  {
    name: "cplusplus_file",
    extensions: ["c++", "cc", "cpp", "cxx", "hh", "hpp", "hxx", "ii", "inl", "ipp", "pch", "tcc", "tpp", "vcxproj"],
  },
  {
    name: "crystal_file",
    extensions: ["cr"],
  },
  {
    name: "csharp_file",
    extensions: ["cs", "csharp", "csproj", "csx"],
  },
  {
    name: "css_file",
    extensions: ["css", "less", "scss"],
  },
  {
    name: "css_folder",
    foldernames: ["css", "less", "postcss", "sass", "scss", "styles", "stylesheets"],
  },
  {
    name: "damage_type_file",
    extensions: ["damage_type/json"],
  },
  {
    name: "damage_type_folder",
    foldernames: ["damage_type"],
  },
  {
    name: "dart_file",
    extensions: ["dart"],
  },
  {
    name: "dart_folder",
    foldernames: [".dart_tool"],
  },
  {
    name: "data_folder",
    foldernames: ["data"],
  },
  {
    name: "data_folder_closed",
    foldernames: ["data"],
  },
  {
    name: "database_file",
    extensions: ["accdb", "db", "db3", "dbf", "fdb", "frm", "gdb", "ldb", "mdb", "mongodb", "myd", "myi", "nsf", "odb", "pdb", "pgsql", "pkb", "pks", "postgres", "psql", "sdb", "sql", "sqlite", "sqlite3"],
  },
  {
    name: "database_folder",
    foldernames: ["database", "db", "migrations", "resources", "seeds", "sql"],
  },
  {
    name: "datapacks_folder",
    foldernames: ["datapacks"],
  },
  {
    name: "dialog_file",
    extensions: ["dialog/json"],
  },
  {
    name: "dialog_folder",
    foldernames: ["dialog"],
  },
  {
    name: "dimension_file",
    extensions: ["dimension/json"],
  },
  {
    name: "dimension_folder",
    foldernames: ["dimension"],
  },
  {
    name: "dimension_type_file",
    extensions: ["dimension_type/json"],
  },
  {
    name: "dimension_type_folder",
    foldernames: ["dimension_type", "portaltypes"],
  },
  {
    name: "dlang_file",
    extensions: ["d", "dd", "di"],
  },
  {
    name: "docker_file",
    extensions: ["dockerignore"],
    filenames: ["compose.override.json", "compose.override.yaml", "compose.override.yml", "compose.yaml", "compose.yml", "docker-compose.override.yaml", "docker-compose.override.yml", "docker-compose.yaml", "docker-compose.yml", "Dockerfile"],
  },
  {
    name: "docker_folder",
    foldernames: [".docker"],
  },
  {
    name: "document_file",
    extensions: ["doc", "docx", "dot", "fodt", "ltx", "odm", "odt", "pages", "wpd", "wps"],
  },
  {
    name: "editorconfig_file",
    filenames: [".editorconfig"],
  },
  {
    name: "ejs_file",
    extensions: ["ejs"],
  },
  {
    name: "elixir_file",
    extensions: ["eex", "ex", "exs", "heex", "leex", "sface"],
  },
  {
    name: "elm_file",
    extensions: ["elm"],
  },
  {
    name: "elm_folder",
    foldernames: ["elm-stuff"],
  },
  {
    name: "enchantment_file",
    extensions: ["enchantment/json", "enchantment_provider/json"],
  },
  {
    name: "enchantment_folder",
    foldernames: ["enchantment", "enchantment_provider"],
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
    name: "equipment_file",
    extensions: ["equipment/json"],
  },
  {
    name: "equipment_folder",
    foldernames: ["equipment"],
  },
  {
    name: "erlang_file",
    extensions: ["erl", "hrl"],
  },
  {
    name: "excel_file",
    extensions: ["csv", "ods", "psv", "tsv", "xls", "xlsb", "xlsm", "xlsx", "xlw"],
  },
  {
    name: "executable_file",
    extensions: ["app", "appx", "com", "dmg", "exe", "msi", "out", "pdx", "pdz", "run"],
  },
  {
    name: "executable_folder",
    foldernames: ["app", "bin", "build", "dist", "out", "publish", "release", "releases"],
  },
  {
    name: "fabric_file",
    extensions: ["accesswidener"],
    filenames: ["fabric-mod.json"],
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
    name: "fennel_file",
    extensions: ["fnl"],
  },
  {
    name: "fogs_file",
    extensions: ["atmospherics/json", "fogs/json"],
  },
  {
    name: "fogs_folder",
    foldernames: ["atmospherics", "fogs", "environments"],
  },
  {
    name: "font_file",
    extensions: ["font", "font/json", "ttf", "fontdata", "bmap", "eot", "fnt", "fonts", "mrf", "ntf", "odttf", "otf", "pft", "sui", "suit", "ttc", "woff", "woff2"],
  },
  {
    name: "font_folder",
    foldernames: ["font", "fonts"],
  },
  {
    name: "forge_file",
    filenames: ["accesstransformer.cfg", "mcmod.info", "mods.toml"],
  },
  {
    name: "fortran_file",
    extensions: ["f", "f03", "f08", "f18", "f77", "f90", "f95", "for", "ftn"],
  },
  {
    name: "fox_file",
    extensions: ["fox"],
    filenames: [".gitlab-ci.yaml", ".gitlab-ci.yml", "neoforge.mods.toml"],
  },
  {
    name: "fragment_shader_file",
    extensions: ["fsh", "fp", "frag"],
  },
  {
    name: "frog_variant_file",
    extensions: ["frog_variant/json"],
  },
  {
    name: "frog_variant_folder",
    foldernames: ["frog_variant"],
  },
  {
    name: "fsharp_file",
    extensions: ["fs", "fsi", "fsproj", "fsx"],
  },
  {
    name: "function_folder",
    foldernames: ["function", "functions"],
  },
  {
    name: "gamemaker_file",
    extensions: ["gml", "yy", "yymp", "yyp", "yyz"],
  },
  {
    name: "git_file",
    extensions: ["git"],
    filenames: [".gitattributes", ".gitmodules"],
  },
  {
    name: "git_folder",
    foldernames: [".git"],
  },
  {
    name: "github_folder",
    foldernames: [".github", "github"],
  },
  {
    name: "gitignore_file",
    extensions: ["gitignore"],
  },
  {
    name: "gleam_file",
    extensions: ["gleam"],
  },
  {
    name: "glsl_file",
    extensions: ["glsl", "comp", "geom", "hlsl", "tesc", "tese", "wgsl"],
  },
  {
    name: "go_file",
    extensions: ["go"],
  },
  {
    name: "godot_file",
    extensions: ["gd", "gdextension", "tres", "tscn", "uid"],
  },
  {
    name: "godot_folder",
    foldernames: [".godot"],
  },
  {
    name: "godot_project_file",
    filenames: ["project.godot"],
  },
  {
    name: "godotignore_file",
    extensions: ["gdignore"],
  },
  {
    name: "gradle_file",
    extensions: ["gradle", "gradle.kts"],
    filenames: ["gradle-wrapper.properties", "gradle.properties", "gradlew", "gradlew.bat"],
  },
  {
    name: "gradle_folder",
    foldernames: [".gradle", "buildSrc", "gradle"],
  },
  {
    name: "graphql_file",
    extensions: ["gql", "graphql", "graphqls"],
  },
  {
    name: "groovy_file",
    extensions: ["groovy"],
  },
  {
    name: "haskell_file",
    extensions: ["cabal", "hs", "lhs"],
    filenames: ["cabal.project", "cabal.project.freeze", "cabal.project.local"],
  },
  {
    name: "haxe_file",
    extensions: ["hx"],
    filenames: ["haxelib.json"],
  },
  {
    name: "hjmc_file",
    extensions: ["hjmc"],
  },
  {
    name: "holy_c_file",
    extensions: ["hc", "hc.z"],
  },
  {
    name: "html_file",
    extensions: ["hta", "htm", "html", "htmls", "xht", "xhtml"],
  },
  {
    name: "image_file",
    extensions: ["painting_variant/json", "png", "afphoto", "ami", "apx", "art", "avif", "bmp", "bpg", "brk", "cd5", "cdr", "cgm", "clip", "cpt", "cur", "dcm", "dds", "djvu", "dng", "ecw", "eps", "exr", "flif", "fpx", "gbr", "gif", "hdr", "heic", "heif", "icns", "ico", "iff", "img", "jb2", "jbig2", "jfif", "jng", "jp2", "jpeg", "jpg", "jxr", "kra", "mdp", "mng", "ora", "pbm", "pcx", "pdi", "pdn", "pgf", "pgm", "pgx", "pic", "pnm", "ppm", "psb", "psd", "raw", "reb", "sai", "sid", "svg", "tga", "tif", "tiff", "vtf", "wbmp", "webp", "wmf", "xcf"],
  },
  {
    name: "image_folder",
    foldernames: ["painting_variant", "textures", "blocktextures", "icons", "images", "sprites"],
  },
  {
    name: "instrument_file",
    extensions: ["instrument/json"],
  },
  {
    name: "instrument_folder",
    foldernames: ["instrument"],
  },
  {
    name: "item_modifier_file",
    extensions: ["item_modifier/json", "item_modifiers/json", "item_catalog/json"],
  },
  {
    name: "item_modifier_folder",
    foldernames: ["item_modifier", "item_modifiers", "item_catalog"],
  },
  {
    name: "items_file",
    extensions: ["items/json"],
  },
  {
    name: "items_folder",
    foldernames: ["items"],
  },
  {
    name: "jar_file",
    extensions: ["jar"],
  },
  {
    name: "jar_folder",
    foldernames: ["mods", "plugins", "target"],
  },
  {
    name: "java_file",
    extensions: ["class", "java", "jmod", "jsp", "jws"],
  },
  {
    name: "javascript_file",
    extensions: ["cjs", "es6", "jake", "js", "jsm", "jss", "mjs", "pac"],
  },
  {
    name: "javascript_folder",
    foldernames: ["javascript", "javascripts", "js", "script", "scripts"],
  },
  {
    name: "jetbrains_file",
    extensions: ["iml", "ipr", "iws"],
  },
  {
    name: "jetbrains_folder",
    foldernames: [".idea"],
  },
  {
    name: "jmc_file",
    extensions: ["jmc"],
  },
  {
    name: "jsconfig_file",
    filenames: ["jsconfig.json"],
  },
  {
    name: "json_file",
    extensions: ["json", "har", "json5", "jsonc", "jsonl", "jsonld", "ndjson", "pdt", "topojson", "webmanifest"],
  },
  {
    name: "jukebox_song_file",
    extensions: ["jukebox_song/json"],
  },
  {
    name: "jukebox_song_folder",
    foldernames: ["jukebox_song", "music"],
  },
  {
    name: "julia_file",
    extensions: ["jl"],
  },
  {
    name: "julia_folder",
    foldernames: [".julia"],
  },
  {
    name: "kotlin_file",
    extensions: ["kt", "kts"],
  },
  {
    name: "lang_file",
    extensions: ["lang", "lang/json"],
    filenames: ["language_names.json", "languages.json"],
  },
  {
    name: "lang_folder",
    foldernames: ["lang", "languages"],
  },
  {
    name: "latex_file",
    extensions: ["tex"],
  },
  {
    name: "level.dat_file",
    filenames: ["level.dat"],
  },
  {
    name: "license_file",
    filenames: ["LICENSE", "LICENSE.md", "LICENSE.txt"],
  },
  {
    name: "linux_file",
    extensions: ["deb", "so"],
  },
  {
    name: "linux_folder",
    foldernames: ["alpine", "appimage", "archlinux", "centos", "deb", "debian", "fedora", "flatpak", "gentoo", "gnu", "grub", "init.d", "kali", "kalilinux", "linux", "nixos", "opensuse", "posix", "raspbian", "redhat", "rpm", "snap", "suse", "systemd", "ubuntu", "unix", "wsl"],
  },
  {
    name: "lisp_file",
    extensions: ["fasl", "lisp", "lsp"],
  },
  {
    name: "load.json_file",
    filenames: ["function/load.json", "functions/load.json"],
  },
  {
    name: "lock_file",
    extensions: ["checksum", "crc", "hash", "hashes", "lock", "lock.json", "lockb", "lockfile", "md5", "sha1", "sha256", "sha512"],
    filenames: ["go.sum", "package-lock.json", "pnpm-lock.yaml", "pnpm-lock.yml"],
  },
  {
    name: "log_file",
    extensions: ["dmp", "dump", "err", "log", "tmp"],
  },
  {
    name: "log_folder",
    foldernames: ["logs"],
  },
  {
    name: "loom_file",
    extensions: ["loom.gradle", "loom.gradle.kts"],
  },
  {
    name: "loot_table_file",
    extensions: ["loot_table/json", "loot_tables/json"],
  },
  {
    name: "loot_table_folder",
    foldernames: ["loot_table", "loot_tables", "drops"],
  },
  {
    name: "lua_file",
    extensions: ["lua", "luac", "luau", "luc"],
  },
  {
    name: "markdown_file",
    extensions: ["markdn", "markdown", "md", "md.rendered", "mdown", "mdtext", "mdtxt", "mdwn", "mdx", "mkd", "mkdn", "rst"],
  },
  {
    name: "materials_file",
    extensions: ["material"],
  },
  {
    name: "materials_folder",
    foldernames: ["materials"],
  },
  {
    name: "maven_file",
    extensions: ["pom"],
  },
  {
    name: "maven_folder",
    foldernames: [".m2", ".mvn"],
  },
  {
    name: "mcfunction_file",
    extensions: ["mcfunction"],
  },
  {
    name: "models_file",
    extensions: ["models/json", "3dm", "3ds", "3mf", "blend", "blockymodel", "c4d", "collada", "dxf", "fbx", "glb", "gltf", "iges", "ipt", "ma", "max", "mb", "mesh", "mqo", "obj", "ply", "pmx", "skp", "step", "stl", "stp", "usd", "usda", "usdc", "usdz", "vox", "vrm", "wrl", "x3d"],
  },
  {
    name: "models_folder",
    foldernames: ["models"],
  },
  {
    name: "modrinth_file",
    extensions: ["modrinth.json", "mrpack"],
    filenames: ["modrinth.index.json"],
  },
  {
    name: "mojo_file",
    extensions: ["mojo", "mojom", "�"],
  },
  {
    name: "mongodb_file",
    extensions: ["mongo"],
  },
  {
    name: "moonscript_file",
    extensions: ["moon"],
  },
  {
    name: "nbt_file",
    extensions: ["nbt"],
  },
  {
    name: "neovim_file",
    filenames: ["nvim/init.lua", "nvim/init.vim"],
  },
  {
    name: "neovim_folder",
    foldernames: ["nvim"],
  },
  {
    name: "nim_file",
    extensions: ["nim", "nim.cfg", "nimble", "nims"],
  },
  {
    name: "nim_folder",
    foldernames: ["nim", "nimcache"],
  },
  {
    name: "npm_file",
    filenames: [".npmrc", "package.json"],
  },
  {
    name: "npm_folder",
    foldernames: ["node_modules"],
  },
  {
    name: "npmignore_file",
    extensions: ["npmignore"],
  },
  {
    name: "objective_c_file",
    extensions: ["m", "mm"],
  },
  {
    name: "ocaml_file",
    extensions: ["ml", "mli"],
  },
  {
    name: "odin_file",
    extensions: ["odin"],
  },
  {
    name: "pack.mcmeta_file",
    filenames: ["pack.mcmeta", "manifest.json"],
  },
  {
    name: "paper_file",
    filenames: ["paper-global.yaml", "paper-global.yml", "paper-plugin.yaml", "paper-plugin.yml", "paper-world-defaults.yaml", "paper-world-defaults.yml", "paper-world.yaml", "paper-world.yml"],
  },
  {
    name: "particles_file",
    extensions: ["particles/json"],
  },
  {
    name: "particles_folder",
    foldernames: ["particles", "trails"],
  },
  {
    name: "pascal_file",
    extensions: ["dpr", "inc", "lpr", "pas", "pp"],
  },
  {
    name: "pdf_file",
    extensions: ["pdf", "rtf"],
    filenames: ["CODE_OF_CONDUCT", "CODE_OF_CONDUCT.md", "CODE_OF_CONDUCT.txt"],
  },
  {
    name: "perl_file",
    extensions: ["pl", "pls", "plx", "pm", "xs"],
  },
  {
    name: "php_file",
    extensions: ["php"],
  },
  {
    name: "pig_variant_file",
    extensions: ["pig_variant/json"],
  },
  {
    name: "pig_variant_folder",
    foldernames: ["pig_sound_variant", "pig_variant"],
  },
  {
    name: "playdate_file",
    filenames: ["pdxinfo"],
  },
  {
    name: "predicate_file",
    extensions: ["predicate/json", "predicates/json"],
  },
  {
    name: "predicate_folder",
    foldernames: ["predicate", "predicates"],
  },
  {
    name: "prettier_file",
    filenames: [".prettierrc", ".prettierrc.json", ".prettierrc.json5", ".prettierrc.yaml", ".prettierrc.yml"],
  },
  {
    name: "prettierignore_file",
    extensions: ["prettierignore"],
  },
  {
    name: "prisma_file",
    extensions: ["prisma"],
  },
  {
    name: "purpur_file",
    filenames: ["purpur.yaml", "purpur.yml"],
  },
  {
    name: "python_compiled_file",
    extensions: ["pyc", "pyd", "pyo", "whl"],
  },
  {
    name: "python_file",
    extensions: ["ipynb", "py", "pyde", "pyi", "pyp", "pyt", "pyw"],
    filenames: ["Pipfile", "pyproject.toml"],
  },
  {
    name: "python_folder",
    foldernames: ["__pycache__"],
  },
  {
    name: "quilt_file",
    filenames: ["quilt.mod.json"],
  },
  {
    name: "readme_file",
    filenames: ["README", "README.md", "README.txt"],
  },
  {
    name: "reason_react_file",
    extensions: ["jsx", "re", "rei", "tsx"],
  },
  {
    name: "recipe_file",
    extensions: ["recipe/json", "recipes/json", "zs"],
  },
  {
    name: "recipe_folder",
    foldernames: ["recipe", "recipes"],
  },
  {
    name: "render_controllers_file",
    extensions: ["render_controllers/render_controllers.json"],
  },
  {
    name: "render_controllers_folder",
    foldernames: ["render_controllers"],
  },
  {
    name: "requirements.txt_file",
    filenames: ["requirements.txt"],
  },
  {
    name: "rlang_file",
    extensions: ["r", "rda", "rdata", "rds", "rhistory", "rmd", "rprofile", "rproj"],
  },
  {
    name: "rss_file",
    extensions: ["rss"],
  },
  {
    name: "ruby_file",
    extensions: ["erb", "gemspec", "jbuilder", "mspec", "podspec", "rabl", "rake", "rb", "rbi", "rbs"],
    filenames: ["Gemfile"],
  },
  {
    name: "rust_file",
    extensions: ["rlib", "ron", "rs"],
  },
  {
    name: "scala_file",
    extensions: ["sc", "scala"],
  },
  {
    name: "scala_folder",
    foldernames: [".bloop", ".metals"],
  },
  {
    name: "shaders_file",
    extensions: ["post_effect/json", "shaders/json", "color_grading/json", "gdshader"],
  },
  {
    name: "shaders_folder",
    foldernames: ["post_effect", "shaders", "color_grading", "screeneffects", "tintgradients"],
  },
  {
    name: "shell_file",
    extensions: ["ash", "awk", "bash", "bat", "bsh", "cmd", "command", "csh", "exp", "fish", "ksh", "ksh93", "mksh", "nu", "pdksh", "ps1", "ps1xml", "psc1", "psd1", "psm1", "pssc", "rbash", "rc", "sh", "tcl", "tcsh", "zsh"],
  },
  {
    name: "shell_folder",
    foldernames: ["bash", "cli", "cmd", "powershell", "pwsh", "sh", "shell", "shells", "terminal", "zsh"],
  },
  {
    name: "sounds.json_file",
    filenames: ["sounds.json"],
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
    name: "spigot_file",
    filenames: ["spigot.yaml", "spigot.yml"],
  },
  {
    name: "splashes.json_file",
    filenames: ["splashes.txt", "splashes.json"],
  },
  {
    name: "sponge_mixins_file",
    extensions: ["mixins.json", "mixins/java", "refmap.json"],
  },
  {
    name: "spwn_file",
    extensions: ["spwn"],
  },
  {
    name: "spyglass_file",
    extensions: ["mcdoc", "cameras/json"],
  },
  {
    name: "spyglass_folder",
    foldernames: ["mcdoc", "cameras", "camera"],
  },
  {
    name: "src_folder",
    foldernames: ["src"],
  },
  {
    name: "src_folder_closed",
    foldernames: ["src"],
  },
  {
    name: "structure_file",
    extensions: ["structure/nbt", "structures/nbt", "mcstructure"],
  },
  {
    name: "structure_folder",
    foldernames: ["structure", "structures", "instances"],
  },
  {
    name: "sublime_file",
    extensions: ["sublime-build", "sublime-keymap", "sublime-macro", "sublime-project", "sublime-settings", "sublime-snippet", "sublime-syntax", "sublime-workspace"],
  },
  {
    name: "svelte_file",
    extensions: ["svelte"],
  },
  {
    name: "swift_file",
    extensions: ["swift", "swiftdeps", "swiftdoc", "swiftinterface", "swiftmodule", "swiftsourceinfo"],
  },
  {
    name: "tags_folder",
    foldernames: ["tags", "tag_patterns", "weathers"],
  },
  {
    name: "terraform_file",
    extensions: ["tf"],
  },
  {
    name: "terraform_folder",
    foldernames: [".terraform"],
  },
  {
    name: "test.js_file",
    extensions: ["test.js"],
  },
  {
    name: "test.ts_file",
    extensions: ["test.ts"],
  },
  {
    name: "test_environment_file",
    extensions: ["test_environment/json"],
  },
  {
    name: "test_environment_folder",
    foldernames: ["test_environment", "__tests__", "test", "tests"],
  },
  {
    name: "test_instance_file",
    extensions: ["test_instance/json"],
  },
  {
    name: "test_instance_folder",
    foldernames: ["test_instance"],
  },
  {
    name: "text_file",
    extensions: ["txt"],
  },
  {
    name: "text_folder",
    foldernames: ["texts", "wordlists"],
  },
  {
    name: "tick.json_file",
    filenames: ["function/tick.json", "functions/tick.json"],
  },
  {
    name: "timeline_file",
    extensions: ["timeline/json", "world_clock/json"],
    filenames: ["CHANGELOG", "CHANGELOG.md", "CHANGELOG.txt"],
  },
  {
    name: "timeline_folder",
    foldernames: ["timeline", "world_clock"],
  },
  {
    name: "todo_file",
    extensions: ["taskpaper", "tasks", "todo", "todos"],
    filenames: ["todo.md", "todo.txt"],
  },
  {
    name: "todo_folder",
    foldernames: ["backlog", "kanban", "milestones", "planning", "plans", "roadmap", "tickets", "todo", "todos"],
  },
  {
    name: "toml_file",
    extensions: ["toml"],
  },
  {
    name: "trading_file",
    extensions: ["trade_set/json", "villager_trade/json", "trading/json"],
  },
  {
    name: "trading_folder",
    foldernames: ["trade_set", "villager_trade", "trading", "bartershops", "npc"],
  },
  {
    name: "trial_spawner_file",
    extensions: ["trial_spawner/json"],
  },
  {
    name: "trial_spawner_folder",
    foldernames: ["trial_spawner"],
  },
  {
    name: "trim_material_file",
    extensions: ["trim_material/json"],
  },
  {
    name: "trim_material_folder",
    foldernames: ["trim_material", "cosmetics"],
  },
  {
    name: "trim_pattern_file",
    extensions: ["trim_pattern/json"],
  },
  {
    name: "trim_pattern_folder",
    foldernames: ["trim_pattern", "responsecurves"],
  },
  {
    name: "tsconfig_file",
    filenames: ["tsconfig.json"],
  },
  {
    name: "typescript_file",
    extensions: ["cts", "ts", "tsbuildinfo"],
  },
  {
    name: "typst_file",
    extensions: ["typ"],
  },
  {
    name: "typst_folder",
    foldernames: ["typst-packages"],
  },
  {
    name: "ui_file",
    extensions: ["ui/json"],
  },
  {
    name: "ui_folder",
    foldernames: ["ui"],
  },
  {
    name: "vala_file",
    extensions: ["vala", "vapi"],
  },
  {
    name: "valve_file",
    extensions: ["bsp", "vmf", "vmt"],
  },
  {
    name: "vertex_shader_file",
    extensions: ["vsh", "vert", "workflows/yaml", "workflows/yml"],
  },
  {
    name: "video_file",
    extensions: ["mcmeta", "animation_controllers/json", "animations/animation.json", "3g2", "3gp", "amv", "asf", "avi", "blockyanim", "f4p", "f4v", "flv", "gifv", "m4v", "mkv", "mov", "mp4", "mpe", "mpeg", "mpg", "mpv", "mxf", "nsv", "ogv", "pdv", "qt", "rm", "roq", "svi", "vob", "webm", "wmv", "yuv"],
    filenames: ["textures/flipbook_textures.json"],
  },
  {
    name: "video_folder",
    foldernames: ["animation_controllers", "animations", "vfx"],
  },
  {
    name: "vim_file",
    extensions: ["vim"],
    filenames: [".gvimrc", ".vimrc", "_gvimrc", "_vimrc"],
  },
  {
    name: "vim_folder",
    foldernames: [".vim"],
  },
  {
    name: "vlang_file",
    extensions: ["v"],
  },
  {
    name: "vs_file",
    extensions: ["sln", "vbproj"],
  },
  {
    name: "vs_folder",
    foldernames: [".vs"],
  },
  {
    name: "vscode_file",
    extensions: ["code-profile", "code-snippets", "code-workplace", "code-workspace", "vsix", "vsixmanifest"],
  },
  {
    name: "vscode_folder",
    foldernames: [".vscode"],
  },
  {
    name: "vscodeignore_file",
    extensions: ["vscodeignore"],
  },
  {
    name: "waypoint_style_file",
    extensions: ["waypoint_style/json"],
  },
  {
    name: "waypoint_style_folder",
    foldernames: ["waypoint_style", "objective"],
  },
  {
    name: "web_assembly_file",
    extensions: ["wasm", "wat"],
  },
  {
    name: "wolf_variant_file",
    extensions: ["wolf_variant/json"],
  },
  {
    name: "wolf_variant_folder",
    foldernames: ["wolf_sound_variant", "wolf_variant"],
  },
  {
    name: "worldgen_file",
    extensions: ["biomes/json"],
  },
  {
    name: "worldgen_folder",
    foldernames: ["worldgen", "biomes", "world"],
  },
  {
    name: "xml_file",
    extensions: ["admx", "filters", "ivy", "jelly", "mxml", "nuspec", "resx", "targets", "tld", "wsdl", "xib", "xlf", "xliff", "xmi", "xml", "xsd", "xsl", "xslt"],
  },
  {
    name: "yaml_file",
    extensions: ["rviz", "yaml", "yml"],
  },
  {
    name: "zig_file",
    extensions: ["zig", "zir", "zon"],
  },
  {
    name: "zig_folder",
    foldernames: ["zig", "zig-cache", "zig-out"],
  },
  {
    name: "zombie_nautilus_variant_file",
    extensions: ["zombie_nautilus_variant/json"],
  },
  {
    name: "zombie_nautilus_variant_folder",
    foldernames: ["zombie_nautilus_variant"],
  },
]
