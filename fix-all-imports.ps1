# 批量修复所有 UI 组件导入的大小写问题
# 将所有 @/components/ui/[Component] 改为 @/components/ui/[component]

$files = Get-ChildItem -Path "src" -Recurse -Include *.tsx,*.ts

$replacements = @{
    "@/components/ui/Button" = "@/components/ui/button"
    "@/components/ui/Badge" = "@/components/ui/badge"
    "@/components/ui/Label" = "@/components/ui/label"
    "@/components/ui/Input" = "@/components/ui/input"
    "@/components/ui/Card" = "@/components/ui/card"
    "@/components/ui/Dialog" = "@/components/ui/dialog"
    "@/components/ui/Progress" = "@/components/ui/progress"
    "@/components/ui/Tabs" = "@/components/ui/tabs"
}

$totalFixed = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    foreach ($old in $replacements.Keys) {
        $new = $replacements[$old]
        $content = $content -replace [regex]::Escape($old), $new
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Fixed: $($file.FullName)"
        $totalFixed++
    }
}

Write-Host "`nTotal files fixed: $totalFixed"
