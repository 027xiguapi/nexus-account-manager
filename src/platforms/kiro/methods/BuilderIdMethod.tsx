/**
 * Kiro 平台 - BuilderID 登录方式
 * 
 * 使用 AWS Builder ID 的 Device Code Flow 登录
 */

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, AlertCircle, Copy, Check, ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
// @ts-ignore
import { openUrl } from '@tauri-apps/plugin-opener';
import { invoke } from '@tauri-apps/api/core'
import type { AddMethodProps } from '@/types/platform'
import type { KiroAccount } from '@/types/account'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'waiting' | 'success' | 'error'

interface DeviceCodeData {
    deviceCode: string
    userCode: string
    verificationUri: string
    expiresIn: number
    interval: number
    clientId: string
    clientSecret: string
}

export function BuilderIdMethod({ onSuccess, onError, onClose }: AddMethodProps) {
    const { i18n } = useTranslation()
    const isEn = i18n.language === 'en'

    const [status, setStatus] = useState<Status>('idle')
    const [message, setMessage] = useState('')
    const [deviceCodeData, setDeviceCodeData] = useState<DeviceCodeData | null>(null)
    const [copied, setCopied] = useState(false)
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // 清理轮询
    useEffect(() => {
        return () => {
            if (pollRef.current) clearInterval(pollRef.current)
        }
    }, [])

    // 开始登录
    const handleStartLogin = async () => {
        setStatus('waiting')
        setMessage(isEn ? 'Initializing...' : '正在初始化...')

        try {
            const result = await invoke<DeviceCodeData>('kiro_start_device_auth')
            setDeviceCodeData(result)
            setMessage(isEn
                ? 'Please copy the code and complete authorization in browser'
                : '请复制验证码并在浏览器中完成授权')

            // 打开浏览器
            try {
                // @ts-ignore
                await openUrl(result.verificationUri)
            } catch (e) {
                console.error("Open failed, fallback", e)
                window.open(result.verificationUri, '_blank')
            }

            // 开始轮询
            startPolling(result.interval, result)
        } catch (e: any) {
            setStatus('error')
            setMessage(e.message || (isEn ? 'Failed to start login' : '登录启动失败'))
            onError(e.message)
        }
    }

    // 轮询授权状态
    const startPolling = (interval: number, authData: DeviceCodeData) => {
        if (pollRef.current) clearInterval(pollRef.current)

        pollRef.current = setInterval(async () => {
            try {
                const result = await invoke<{ completed: boolean; account?: KiroAccount; error?: string }>('kiro_poll_token', {
                    deviceCode: authData.deviceCode,
                    clientId: authData.clientId,
                    clientSecret: authData.clientSecret
                })

                if (result.completed && result.account) {
                    clearInterval(pollRef.current!)
                    setStatus('success')
                    setMessage(isEn ? 'Login successful!' : '登录成功！')
                    onSuccess(result.account)
                    setTimeout(onClose, 1000)
                } else if (result.error) {
                    clearInterval(pollRef.current!)
                    setStatus('error')
                    setMessage(result.error)
                    onError(result.error)
                }
            } catch (e: any) {
                // 继续轮询，除非是致命错误
                if (e.message?.includes('expired')) {
                    clearInterval(pollRef.current!)
                    setStatus('error')
                    setMessage(isEn ? 'Authorization expired, please try again' : '授权已过期，请重试')
                }
            }
        }, interval * 1000)
    }

    // 复制验证码
    const handleCopy = async () => {
        if (deviceCodeData?.userCode) {
            await navigator.clipboard.writeText(deviceCodeData.userCode)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    // 取消登录
    const handleCancel = () => {
        if (pollRef.current) clearInterval(pollRef.current)
        invoke('kiro_cancel_auth').catch(() => { })
        setStatus('idle')
        setDeviceCodeData(null)
        setMessage('')
    }

    return (
        <div className="space-y-4">
            {status === 'idle' && (
                <Button
                    variant="outline"
                    className="w-full py-6 gap-2"
                    onClick={handleStartLogin}
                >
                    <ExternalLink className="h-4 w-4" />
                    {isEn ? 'Login with AWS Builder ID' : '使用 AWS Builder ID 登录'}
                </Button>
            )}

            {/* Device Code Display */}
            {deviceCodeData && status === 'waiting' && (
                <div className="space-y-3 animate-in fade-in">
                    <div className="text-center p-4 rounded-lg border bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-2">
                            {isEn ? 'Your verification code:' : '您的验证码：'}
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <code className="text-2xl font-bold tracking-widest">
                                {deviceCodeData.userCode}
                            </code>
                            <Button variant="ghost" size="icon" onClick={handleCopy}>
                                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={async () => {
                                // @ts-ignore
                                try { await openUrl(deviceCodeData.verificationUri) }
                                catch (e) { window.open(deviceCodeData.verificationUri, '_blank') }
                            }}
                        >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            {isEn ? 'Open Browser' : '打开浏览器'}
                        </Button>
                        <Button variant="ghost" onClick={handleCancel}>
                            {isEn ? 'Cancel' : '取消'}
                        </Button>
                    </div>
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
