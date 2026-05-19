#!/bin/sh
# Creates symlink from zed/icons -> icons/
# Run after cloning: bash scripts/link-zed-icons.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

ln -sfn "$ROOT_DIR/icons" "$ROOT_DIR/zed/icons"
echo "Created zed/icons -> ../icons symlink"
