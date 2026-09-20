$ErrorActionPreference = "Stop"
$target = "C:\Users\Chris\Desktop\Pegs Website v12"
$source = Split-Path -Parent $MyInvocation.MyCommand.Path
if (!(Test-Path $target)) { throw "PEGS folder not found: $target" }
$backup = Join-Path $target ("backup-v14.8.4-" + (Get-Date -Format "yyyyMMdd-HHmmss"))
New-Item -ItemType Directory -Path $backup -Force | Out-Null
foreach ($file in @("app.js","styles.css","sw.js")) {
  if (Test-Path (Join-Path $target $file)) { Copy-Item (Join-Path $target $file) (Join-Path $backup $file) -Force }
  Copy-Item (Join-Path $source $file) (Join-Path $target $file) -Force
}
Copy-Item (Join-Path $source "V14_8_4_E2E_FIXES.sql") (Join-Path $target "V14_8_4_E2E_FIXES.sql") -Force
$edgeTarget = Join-Path $target "supabase\functions\supercoach-sync"
New-Item -ItemType Directory -Path $edgeTarget -Force | Out-Null
if (Test-Path (Join-Path $edgeTarget "index.ts")) { Copy-Item (Join-Path $edgeTarget "index.ts") (Join-Path $backup "supercoach-sync-index.ts") -Force }
Copy-Item (Join-Path $source "supabase\functions\supercoach-sync\index.ts") (Join-Path $edgeTarget "index.ts") -Force
Write-Host "v14.8.4 files applied." -ForegroundColor Green
Write-Host "Backup: $backup" -ForegroundColor Cyan
Write-Host "NEXT: run V14_8_4_E2E_FIXES.sql in Supabase SQL Editor and deploy supercoach-sync/index.ts in Edge Functions." -ForegroundColor Yellow
