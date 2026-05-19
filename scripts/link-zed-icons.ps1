# Creates a directory junction: zed/icons -> ../icons
$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$target = Join-Path $repoRoot "icons"
$link = Join-Path (Join-Path $repoRoot "zed") "icons"

if (Test-Path $link) {
    $item = Get-Item $link -Force
    if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
        Write-Host "zed/icons junction already exists"
        exit 0
    }
    throw "zed/icons exists and is not a junction. Remove it manually first."
}

New-Item -ItemType Junction -Path $link -Target $target | Out-Null
Write-Host "Created junction: $link -> $target"
