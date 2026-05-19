#!/usr/bin/env sh
set -eu
repo_root="$(cd "$(dirname "$0")/.." && pwd)"
target="$repo_root/icons"
link="$repo_root/zed/icons"

if [ -e "$link" ]; then
  if [ -L "$link" ]; then
    echo "zed/icons symlink already exists"
    exit 0
  fi
  echo "zed/icons exists and is not a symlink. Remove it manually first." >&2
  exit 1
fi

ln -s "../icons" "$link"
echo "Created symlink: $link -> ../icons"
