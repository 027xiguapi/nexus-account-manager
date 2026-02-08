/**
 * Antigravity 平台 - OAuth 添加方式
 * 
 * 通过 Google OAuth 授权添加账号
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ExternalLink, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { invoke } from '@tauri-apps/api/core'
import type { AddMethodProps } from '@/types/platform'
import type { AntigravityAccount } from '@/types/account'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'waiting' | 'success' | 'error'

export function OAuthMethod({ onSuccess, onError, onClose }: AddMethodProps) {
    const { i18n } = useTranslation()
    const isEn = i18n.language === 'en'

    const [status, setStatus] = useState<Status>('idle')
    const [message, setMessage] = useState('')
    const [authCode, setAuthCode] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)

    // 启动 OAuth 流程
    const handleStartOAuth = async () => {
        try {
            setStatus('waiting')
            setMessage(isEn ? 'Opening browser for authorization...' : '正在打开浏览器授权...')

            // 调用后端生成 OAuth URL
            const url = await invoke<string>('antigravity_prepare_oauth_url')

            // 打开浏览器
            window.open(url, '_blank')

            setMessage(isEn
                ? 'Please complete authorization in browser, then paste the code below'
                : '请在浏览器中完成授权，然后将授权码粘贴到下方')
        } catch (e: any) {
            setStatus('error')
            setMessage(e.message || (isEn ? 'Failed to start OAuth' : 'OAuth 启动失败'))
            onError(e.message)
        }
    }

    // 完成 OAuth 流程
    const handleCompleteOAuth = async () => {
        if (!authCode.trim()) {
            setMessage(isEn ? 'Please enter authorization code' : '请输入授权码')
            return
        }

        setIsProcessing(true)
        try {
            // 调用后端完成 OAuth
            const account = await invoke<AntigravityAccount>('antigravity_complete_oauth', {
                code: authCode.trim()
            })

            setStatus('success')
            setMessage(isEn ? 'Account added successfully!' : '账号添加成功！')

            setTimeout(() => {
                onSuccess(account)
                onClose()
            }, 1000)
        } catch (e: any) {
            setStatus('error')
            setMessage(e.message || (isEn ? 'OAuth failed' : 'OAuth 失败'))
            onError(e.message)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="space-y-4">
            {/* Step 1: Start OAuth */}
            <Button
                variant="outline"
                className="w-full py-6 gap-2"
                onClick={handleStartOAuth}
                disabled={status === 'waiting' || isProcessing}
            >
                <ExternalLink className="h-4 w-4" />
                {isEn ? 'Open Google Authorization' : '打开 Google 授权页面'}
            </Button>

            {/* Step 2: Enter code */}
            {status === 'waiting' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="grid gap-2">
                        <Label>{isEn ? 'Authorization Code' : '授权码'}</Label>
                        <Input
                            placeholder={isEn ? 'Paste code here...' : '粘贴授权码...'}
                            value={authCode}
                            onChange={(e) => setAuthCode(e.target.value)}
                            className="font-mono"
                        />
                    </div>
                    <Button
                        className="w-full"
                        onClick={handleCompleteOAuth}
                        disabled={isProcessing || !authCode.trim()}
                    >
                        {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEn ? 'Complete Authorization' : '完成授权'}
                    </Button>
                </div>
            )}

            {/* Status Message */}
            {message && (
                <div className={cn(
                    "flex items-center gap-2 p-3 rounded-lg text-sm",
                    status === 'success' && "bg-green-500/10 text-green-600",
                    status === 'error' && "bg-red-500/10 text-red-600",
                    status === 'waiting' && "bg-blue-500/10 text-blue-600"
                )}>
                    {status === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                    {status === 'error' && <AlertCircle className="h-4 w-4 shrink-0" />}
                    {status === 'waiting' && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
                    <span>{message}</span>
                </div>
            )}
        </div>
    )
}
