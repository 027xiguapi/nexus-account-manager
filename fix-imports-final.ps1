# 批量修复所有 UI 组件导入的大小写问题

$files = @(
    "src\components\accounts\AccountCardBase.tsx",
    "src\components\accounts\AccountDetailsDialogBase.tsx",
    "src\components\accounts\AccountSearch.tsx",
    "src\components\accounts\AccountTable.tsx",
    "src\components\dashboard\QuotaCard.tsx",
    "src\components\dashboard\StatCard.tsx",
    "src\components\dialogs\AddAccountDialog.tsx",
    "src\components\dialogs\ConfirmDialog.tsx",
    "src\components\dialogs\ExportDialog.tsx",
    "src\components\layout\TitleBar.tsx",
    "src\components\layout\TopNav.tsx",
    "src\components\ui\alert-dialog.tsx",
    "src\components\ui\form.tsx",
    "src\components\ui\input-group.tsx",
    "src\pages\Accounts.tsx",
    "src\pages\Dashboard.tsx",
    "src\pages\MachineId.tsx",
    "src\pages\Settings.tsx",
    "src\platforms\antigravity\components\AccountList.tsx",
    "src\platforms\antigravity\components\AddAccountDialog.tsx",
    "src\platforms\antigravity\components\AntigravityAccountCard.tsx",
    "src\platforms\antigravity\components\AntigravityAccountDetailsDialog.tsx",
    "src\platforms\antigravity\methods\ImportMethod.tsx",
    "src\platforms\antigravity\methods\OAuthMethod.tsx",
    "src\platforms\antigravity\methods\TokenMethod.tsx",
    "src\platforms\claude\components\AccountList.tsx",
    "src\platforms\claude\components\AddAccountDialog.tsx",
    "src\platforms\claude\components\ClaudeAccountCard.tsx",
    "src\platforms\claude\components\ClaudeAccountDetailsDialog.tsx",
    "src\platforms\claude\components\EditAccountDialog.tsx",
    "src\platforms\claude\components\ProviderSelector.tsx",
    "src\platforms\codex\components\AccountList.tsx",
    "src\platforms\codex\components\AddAccountDialog.tsx",
    "src\platforms\codex\components\CodexAccountCard.tsx",
    "src\platforms\codex\components\CodexAccountDetailsDialog.tsx",
    "src\platforms\codex\components\EditAccountDialog.tsx",
    "src\platforms\codex\components\ProviderSelector.tsx",
    "src\platforms\gemini\components\AccountList.tsx",
    "src\platforms\gemini\components\AddAccountDialog.tsx",
    "src\platforms\gemini\components\EditAccountDialog.tsx",
    "src\platforms\gemini\components\GeminiAccountCard.tsx",
    "src\platforms\gemini\components\GeminiAccountDetailsDialog.tsx",
    "src\platforms\gemini\components\ProviderSelector.tsx",
    "src\platforms\kiro\components\AccountList.tsx",
    "src\platforms\kiro\components\AddAccountDialog.tsx",
    "src\platforms\kiro\components\KiroAccountCard.tsx",
    "src\platforms\kiro\components\KiroAccountDetailsDialog.tsx"
)

$replacements = @{
    '"@/components/ui/Button"' = '"@/components/ui/button"'
    "'@/components/ui/Button'" = "'@/components/ui/button'"
    '"@/components/ui/Badge"' = '"@/components/ui/badge"'
    "'@/components/ui/Badge'" = "'@/components/ui/badge'"
    '"@/components/ui/Label"' = '"@/components/ui/label"'
    "'@/components/ui/Label'" = "'@/components/ui/label'"
    '"@/components/ui/Input"' = '"@/components/ui/input"'
    "'@/components/ui/Input'" = "'@/components/ui/input'"
    '"@/components/ui/Card"' = '"@/components/ui/card"'
    "'@/components/ui/Card'" = "'@/components/ui/card'"
    '"@/components/ui/Dialog"' = '"@/components/ui/dialog"'
    "'@/components/ui/Dialog'" = "'@/components/ui/dialog'"
    '"@/components/ui/Progress"' = '"@/components/ui/progress"'
    "'@/components/ui/Progress'" = "'@/components/ui/progress'"
    '"@/components/ui/Tabs"' = '"@/components/ui/tabs"'
    "'@/components/ui/Tabs'" = "'@/components/ui/tabs'"
}

$totalFixed = 0

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw -Encoding UTF8
        $originalContent = $content
        
        foreach ($old in $replacements.Keys) {
            $new = $replacements[$old]
            $content = $content.Replace($old, $new)
        }
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file -Value $content -Encoding UTF8 -NoNewline
            Write-Host "Fixed: $file"
            $totalFixed++
        }
    }
}

Write-Host "`nTotal files fixed: $totalFixed"
