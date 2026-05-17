import type { IconDefinition } from "./types"

export const generalIcons: IconDefinition[] = [
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
    name: "aseprite_file",
    extensions: ["ase", "aseprite"],
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
    name: "binary_file",
    extensions: ["a", "bin", "blob", "bson", "dll", "dylib", "hex", "jsxbin", "lib", "o", "res", "scn", "sys"],
  },
  {
    name: "blazor_file",
    extensions: ["cshtml", "razor"],
  },
  {
    name: "bukkit_file",
    filenames: ["bukkit.yaml", "bukkit.yml", "plugin.yaml", "plugin.yml"],
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
    name: "css_file",
    extensions: ["css", "less", "scss"],
  },
  {
    name: "css_folder",
    foldernames: ["css", "less", "postcss", "sass", "scss", "styles", "stylesheets"],
  },
  {
    name: "dart_folder",
    foldernames: [".dart_tool"],
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
    name: "elm_folder",
    foldernames: ["elm-stuff"],
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
    name: "forge_file",
    filenames: ["accesstransformer.cfg", "mcmod.info", "mods.toml"],
  },
  {
    name: "fox_file",
    extensions: ["fox"],
    filenames: [".gitlab-ci.yaml", ".gitlab-ci.yml", "neoforge.mods.toml"],
  },
  {
    name: "generic_file",
  },
  {
    name: "generic_folder",
  },
  {
    name: "generic_folder_closed",
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
    name: "jar_file",
    extensions: ["jar"],
  },
  {
    name: "jar_folder",
    foldernames: ["mods", "plugins", "target"],
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
    name: "jsconfig_file",
    filenames: ["jsconfig.json"],
  },
  {
    name: "julia_folder",
    foldernames: [".julia"],
  },
  {
    name: "latex_file",
    extensions: ["tex"],
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
    name: "markdown_file",
    extensions: ["markdn", "markdown", "md", "md.rendered", "mdown", "mdtext", "mdtxt", "mdwn", "mdx", "mkd", "mkdn", "rst"],
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
    name: "modrinth_file",
    extensions: ["modrinth.json", "mrpack"],
    filenames: ["modrinth.index.json"],
  },
  {
    name: "mongodb_file",
    extensions: ["mongo"],
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
    name: "paper_file",
    filenames: ["paper-global.yaml", "paper-global.yml", "paper-plugin.yaml", "paper-plugin.yml", "paper-world-defaults.yaml", "paper-world-defaults.yml", "paper-world.yaml", "paper-world.yml"],
  },
  {
    name: "pdf_file",
    extensions: ["pdf", "rtf"],
    filenames: ["CODE_OF_CONDUCT", "CODE_OF_CONDUCT.md", "CODE_OF_CONDUCT.txt"],
  },
  {
    name: "playdate_file",
    filenames: ["pdxinfo"],
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
    name: "purpur_file",
    filenames: ["purpur.yaml", "purpur.yml"],
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
    name: "requirements.txt_file",
    filenames: ["requirements.txt"],
  },
  {
    name: "rss_file",
    extensions: ["rss"],
  },
  {
    name: "scala_folder",
    foldernames: [".bloop", ".metals"],
  },
  {
    name: "shell_folder",
    foldernames: ["bash", "cli", "cmd", "powershell", "pwsh", "sh", "shell", "shells", "terminal", "zsh"],
  },
  {
    name: "spigot_file",
    filenames: ["spigot.yaml", "spigot.yml"],
  },
  {
    name: "sponge_mixins_file",
    extensions: ["mixins.json", "mixins/java", "refmap.json"],
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
    name: "sublime_file",
    extensions: ["sublime-build", "sublime-keymap", "sublime-macro", "sublime-project", "sublime-settings", "sublime-snippet", "sublime-syntax", "sublime-workspace"],
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
    name: "text_file",
    extensions: ["txt"],
  },
  {
    name: "text_folder",
    foldernames: ["texts", "wordlists"],
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
    name: "tsconfig_file",
    filenames: ["tsconfig.json"],
  },
  {
    name: "typst_folder",
    foldernames: ["typst-packages"],
  },
  {
    name: "valve_file",
    extensions: ["bsp", "vmf", "vmt"],
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
    name: "xml_file",
    extensions: ["admx", "filters", "ivy", "jelly", "mxml", "nuspec", "resx", "targets", "tld", "wsdl", "xib", "xlf", "xliff", "xmi", "xml", "xsd", "xsl", "xslt"],
  },
  {
    name: "yaml_file",
    extensions: ["rviz", "yaml", "yml"],
  },
  {
    name: "zig_folder",
    foldernames: ["zig", "zig-cache", "zig-out"],
  },
]
