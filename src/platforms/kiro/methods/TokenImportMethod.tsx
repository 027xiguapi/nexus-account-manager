/**
 * Kiro 平台 - Token 导入方式
 * 
 * 支持 SSO Token 和 OIDC 凭证批量导入
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { invoke } from '@tauri-apps/api/core'
import type { AddMethodProps } from '@/types/platform'
import type { KiroAccount } from '@/types/account'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'processing' | 'success' | 'error'
type ImportType = 'sso' | 'oidc'

export function TokenImportMethod({ onSuccess, onError, onClose }: AddMethodProps) {
    const { i18n } = useTranslation()
    const isEn = i18n.language === 'en'

    const [importType, setImportType] = useState<ImportType>('sso')
    const [status, setStatus] = useState<Status>('idle')
    const [message, setMessage] = useState('')
    const [tokenInput, setTokenInput] = useState('')
    const [progress, setProgress] = useState({ current: 0, total: 0 })

    const handleSubmit = async () => {
        const trimmed = tokenInput.trim()
        if (!trimmed) {
            setMessage(isEn ? 'Please enter token(s)' : '请输入 Token')
            return
        }

        setStatus('processing')

        if (importType === 'sso') {
            await handleSsoImport(trimmed)
        } else {
            await handleOidcImport(trimmed)
        }
    }

    const handleSsoImport = async (input: string) => {
        // 按行分割
        const tokens = input.split('\n').map(t => t.trim()).filter(t => t.length > 0)
        setProgress({ current: 0, total: tokens.length })
        setMessage(isEn ? `Processing ${tokens.length} tokens...` : `正在处理 ${tokens.length} 个 Token...`)

        let successCount = 0
        const errors: string[] = []

        for (let i = 0; i < tokens.length; i++) {
            setProgress({ current: i + 1, total: tokens.length })

            try {
                const account = await invoke<KiroAccount>('kiro_import_sso_token', {
                    token: tokens[i]
                })
                onSuccess(account)
                successCount++
            } catch (e: any) {
                errors.push(`#${i + 1}: ${e.message || 'Failed'}`)
            }
        }

        finishImport(successCount, tokens.length, errors)
    }

    const handleOidcImport = async (input: string) => {
        // 解析 JSON
        let credentials: any[]
        try {
            const parsed = JSON.parse(input)
            credentials = Array.isArray(parsed) ? parsed : [parsed]
        } catch {
            setStatus('error')
            setMessage(isEn ? 'Invalid JSON format' : 'JSON 格式错误')
            return
        }

        setProgress({ current: 0, total: credentials.length })
        setMessage(isEn ? `Processing ${credentials.length} credentials...` : `正在处理 ${credentials.length} 个凭证...`)

        let successCount = 0
        const errors: string[] = []

        for (let i = 0; i < credentials.length; i++) {
            setProgress({ current: i + 1, total: credentials.length })

            try {
                const account = await invoke<KiroAccount>('kiro_verify_credentials', {
                    credentials: credentials[i]
                })
                onSuccess(account)
                successCount++
            } catch (e: any) {
                errors.push(`#${i + 1}: ${e.message || 'Failed'}`)
            }
        }

        finishImport(successCount, credentials.length, errors)
    }

    const finishImport = (success: number, total: number, errors: string[]) => {
        if (success === total) {
            setStatus('success')
            setMessage(isEn ? `Added ${success} accounts!` : `成功添加 ${success} 个账号！`)
            setTimeout(onClose, 1500)
        } else if (success > 0) {
            setStatus('success')
            setMessage(isEn ? `Added ${success}/${total} accounts` : `添加了 ${success}/${total} 个账号`)
        } else {
            setStatus('error')
            setMessage(errors[0] || (isEn ? 'All imports failed' : '全部导入失败'))
            onError(errors.join('\n'))
        }
    }

    return (
        <div className="space-y-4">
            <Tabs value={importType} onValueChange={(v) => setImportType(v as ImportType)}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="sso">SSO Token</TabsTrigger>
                    <TabsTrigger value="oidc">OIDC 凭证</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="space-y-2">
                <Label>
                    {importType === 'sso'
                        ? (isEn ? 'SSO Tokens (one per line)' : 'SSO Token（每行一个）')
                        : (isEn ? 'OIDC Credentials (JSON)' : 'OIDC 凭证（JSON）')}
                </Label>
                <textarea
                    className="w-full h-32 rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    placeholder={importType === 'sso'
                        ? 'eyJhbGciOiJSUz...\neyJhbGciOiJSUz...'
                        : '[\n  { "refreshToken": "...", "clientId": "...", "clientSecret": "..." }\n]'}
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    disabled={status === 'processing'}
                />
            </div>

            <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={status === 'processing' || !tokenInput.trim()}
            >
                {status === 'processing' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {status === 'processing'
                    ? `${progress.current}/${progress.total}`
                    : (isEn ? 'Import' : '导入')}
            </Button>

            {/* Status Message */}
            {message && (
                <div className={cn(
                    "flex items-center gap-2 p-3 rounded-lg text-sm",
                    status === 'success' && "bg-green-500/10 text-green-600",
                    status === 'error' && "bg-red-500/10 text-red-600",
                    status === 'processing' && "bg-blue-500/10 text-blue-600"
                )}>
                    {status === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                    {status === 'error' && <AlertCircle className="h-4 w-4 shrink-0" />}
                    {status === 'processing' && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
                    <span>{message}</span>
                </div>
            )}
        </div>
    )
}
