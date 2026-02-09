# 版本更新脚本 (Windows PowerShell)
# 用法: .\scripts\bump-version.ps1 1.1.0

param(
    [Parameter(Mandatory=$true)]
    [string]$NewVersion
)

Write-Host "更新版本到 $NewVersion..." -ForegroundColor Green

# 更新 package.json
npm version $NewVersion --no-git-tag-version

# 更新 src-tauri/tauri.conf.json
$tauriConfig = Get-Content "src-tauri/tauri.conf.json" -Raw
$tauriConfig = $tauriConfig -replace '"version": ".*"', "`"version`": `"$NewVersion`""
Set-Content "src-tauri/tauri.conf.json" $tauriConfig

# 更新 src-tauri/Cargo.toml
$cargoToml = Get-Content "src-tauri/Cargo.toml" -Raw
$cargoToml = $cargoToml -replace 'version = ".*"', "version = `"$NewVersion`""
Set-Content "src-tauri/Cargo.toml" $cargoToml

Write-Host "✅ 版本已更新到 $NewVersion" -ForegroundColor Green
Write-Host ""
Write-Host "下一步:" -ForegroundColor Yellow
Write-Host "1. 检查更改: git diff"
Write-Host "2. 提交更改: git add . ; git commit -m `"chore: bump version to $NewVersion`""
Write-Host "3. 创建标签: git tag v$NewVersion"
Write-Host "4. 推送代码: git push origin main --tags"
