# Creates symlink from zed/icons -> icons/
# Run after cloning: powershell -File scripts/link-zed-icons.ps1

$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$target = Join-Path $rootDir "icons"
$link = Join-Path $rootDir "zed" "icons"

New-Item -ItemType Junction -Path $link -Target $target -Force
Write-Host "Created zed/icons -> ../icons symlink"
