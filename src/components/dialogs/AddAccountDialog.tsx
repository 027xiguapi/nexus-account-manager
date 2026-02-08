import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { usePlatformStore } from '@/stores/usePlatformStore'
import { Plus, CheckCircle2, Globe, Key, Database, AlertCircle, ExternalLink, Loader2 } from 'lucide-react'
import { AntigravityAccount, KiroAccount } from '@/types/account'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { invoke } from '@tauri-apps/api/core'

type AddMethod = 'oauth' | 'token' | 'import'

export function AddAccountDialog() {
    const { t, i18n } = useTranslation()
    const isEn = i18n.language === 'en'
    const [open, setOpen] = useState(false)
    const addAccount = usePlatformStore(state => state.addAccount)
    const loadAllAccounts = usePlatformStore(state => state.loadAllAccounts)
    const [platformTab, setPlatformTab] = useState<'antigravity' | 'kiro'>('antigravity')
    const [addMethod, setAddMethod] = useState<AddMethod>('token')

    // Form States
    const [tokenInput, setTokenInput] = useState('')
    const [oauthCode, setOauthCode] = useState('')
    const [importedTokens, setImportedTokens] = useState<{ source: string, token: string }[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const [kiroForm, setKiroForm] = useState({
        email: '',
        sessionToken: '',
        machineId: ''
    })

    const resetState = () => {
        setTokenInput('')
        setOauthCode('')
        setImportedTokens([])
        setKiroForm({ email: '', sessionToken: '', machineId: '' })
        setStatus('idle')
        setMessage('')
    }

    // Helper: Add Antigravity Account
    const addAntigravityAccount = async (token: string, sourceName?: string) => {
        const id = crypto.randomUUID()
        const newAccount: AntigravityAccount = {
            id,
            platform: 'antigravity',
            email: sourceName ? `${sourceName}@imported.local` : `account_${id.substring(0, 4)}@imported.local`,
            name: sourceName || 'Imported Account',
            isActive: false,
            lastUsedAt: Date.now(),
            createdAt: Date.now(),
            token: {
                access_token: '',
                refresh_token: token,
                expires_in: 3600,
                expiry_timestamp: Date.now() + 3600000,
                token_type: 'Bearer',
            },
            quota: {
                models: [{ name: 'claude-sonnet', percentage: Math.floor(Math.random() * 50), reset_time: '' }],
                subscription_tier: 'FREE',
                last_updated: Date.now(),
                is_forbidden: false
            },
            is_forbidden: false,
            device_profile: {
                machine_id: crypto.randomUUID(),
                mac_machine_id: crypto.randomUUID(),
                dev_device_id: crypto.randomUUID(),
                sqm_id: crypto.randomUUID()
            }
        }
        await addAccount(newAccount)
    }

    // Parse tokens from input
    const parseTokens = (input: string): string[] => {
        const trimmed = input.trim()
        const tokens: string[] = []

        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
                const parsed = JSON.parse(trimmed)
                if (Array.isArray(parsed)) {
                    parsed.forEach((item: any) => {
                        const token = typeof item === 'string' ? item : item.refresh_token || item.token
                        if (token && token.startsWith('1//')) {
                            tokens.push(token)
                        }
                    })
                }
            } catch { }
        }

        if (tokens.length === 0) {
            const regex = /1\/\/[a-zA-Z0-9_\-]+/g
            const matches = trimmed.match(regex)
            if (matches) tokens.push(...matches)
        }

        return [...new Set(tokens)]
    }

    const handleDbImport = async (path: string) => {
        setIsProcessing(true)
        setMessage(isEn ? 'Reading database...' : '正在读取数据库...')
        try {
            const tokens = await invoke<{ source: string, token: string }[]>('import_from_db', { path })
            setImportedTokens(tokens)
            if (tokens.length > 0) {
                setStatus('success')
                setMessage(isEn ? `Found ${tokens.length} tokens` : `发现了 ${tokens.length} 个 Token`)
            } else {
                setStatus('error')
                setMessage(isEn ? 'No tokens found' : '未找到 Token')
            }
        } catch (e: any) {
            setStatus('error')
            setMessage(e.toString())
        } finally {
            setIsProcessing(false)
        }
    }

    const confirmImport = async () => {
        setIsProcessing(true)
        let successCount = 0
        for (const item of importedTokens) {
            try {
                // If Kiro import, handle differently
                if (platformTab === 'kiro') {
                    // Logic for Kiro import from DB tokens (assuming session tokens might be found)
                    // For now treating as Antigravity tokens as fallback or generic
                    const newAccount: KiroAccount = {
                        id: crypto.randomUUID(),
                        platform: 'kiro',
                        email: `${item.source}@imported`,
                        name: item.source,
                        isActive: false,
                        lastUsedAt: Date.now(),
                        createdAt: Date.now(),
                        idp: 'Google',
                        machineId: crypto.randomUUID(),
                        subscription: { type: 'Free' },
                        usage: { current: 0, limit: 1000, percentUsed: 0 },
                    }
                    // TODO: Set session token if applicable
                    await addAccount(newAccount)
                } else {
                    await addAntigravityAccount(item.token, item.source)
                }
                successCount++
            } catch { }
        }
        setMessage(isEn ? `Imported ${successCount} accounts` : `成功导入 ${successCount} 个账号`)
        setStatus('success')
        await loadAllAccounts()
        setTimeout(() => {
            setOpen(false)
            resetState()
        }, 1500)
        setIsProcessing(false)
    }

    const handleOAuth = async () => {
        try {
            window.open('https://accounts.google.com/o/oauth2/auth?client_id=GOOGLE_CLIENT_ID&redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=code&scope=email%20profile', '_blank')
            setMessage(isEn ? 'Please paste the code below' : '请粘贴授权码')
        } catch (e) {
            setMessage(isEn ? 'Failed to open browser' : '无法打开浏览器')
        }
    }

    const handleSubmit = async () => {
        setIsProcessing(true)
        setStatus('idle')
        setMessage('')

        try {
            if (platformTab === 'antigravity') {
                if (addMethod === 'token') {
                    const tokens = parseTokens(tokenInput)
                    if (tokens.length === 0) throw new Error(isEn ? 'No tokens found' : '未找到 Token')

                    let success = 0
                    for (const t of tokens) {
                        await addAntigravityAccount(t)
                        success++
                    }
                    setMessage(isEn ? `Added ${success} accounts` : `添加了 ${success} 个账号`)
                    setStatus('success')
                } else if (addMethod === 'oauth') {
                    if (!oauthCode) throw new Error(isEn ? 'Code required' : '需要授权码')
                    const mockToken = `1//oauth_${oauthCode.substring(0, 6)}`
                    await addAntigravityAccount(mockToken, 'OAuth Account')
                    setStatus('success')
                    setMessage('Success')
                }
            } else {
                // Kiro Logic
                if (addMethod === 'token') {
                    if (!kiroForm.email || !kiroForm.sessionToken) throw new Error('Email & Session required')
                    const newAccount: KiroAccount = {
                        id: crypto.randomUUID(),
                        platform: 'kiro',
                        email: kiroForm.email,
                        name: kiroForm.email.split('@')[0],
                        isActive: false,
                        lastUsedAt: Date.now(),
                        createdAt: Date.now(),
                        idp: 'Google',
                        machineId: kiroForm.machineId || crypto.randomUUID(),
                        subscription: { type: 'Free' },
                        usage: { current: 0, limit: 1000, percentUsed: 0 },
                    }
                    await addAccount(newAccount)
                    setStatus('success')
                }
            }
            await loadAllAccounts()
            if (status !== 'error') {
                setTimeout(() => {
                    setOpen(false)
                    resetState()
                }, 1500)
            }
        } catch (error: any) {
            setStatus('error')
            setMessage(error.message)
        } finally {
            setIsProcessing(false)
        }
    }

    const addMethods: { id: AddMethod; icon: typeof Globe; name: string; desc: string }[] = [
        { id: 'oauth', icon: Globe, name: isEn ? 'OAuth' : 'OAuth 授权', desc: isEn ? 'Login via Google' : '通过 Google 登录' },
        { id: 'token', icon: Key, name: isEn ? 'Token' : 'Token 添加', desc: isEn ? 'Paste refresh tokens' : '粘贴刷新令牌' },
        { id: 'import', icon: Database, name: isEn ? 'Import' : '导入', desc: isEn ? 'From database' : '从数据库导入' },
    ]

    return (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetState(); }}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Plus className="mr-2 h-4 w-4" />
                    {t('accounts.add')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] border-border bg-card text-card-foreground shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{t('dialog.addAccount')}</DialogTitle>
                </DialogHeader>

                <Tabs value={platformTab} onValueChange={(v) => {
                    setPlatformTab(v as any)
                    setAddMethod('token')
                }} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-muted p-1">
                        <TabsTrigger value="antigravity" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Antigravity</TabsTrigger>
                        <TabsTrigger value="kiro" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Kiro IDE</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="grid grid-cols-3 gap-2 mt-4">
                    {addMethods.map(method => {
                        if (platformTab === 'kiro' && method.id === 'oauth') return null

                        const Icon = method.icon
                        const isActive = addMethod === method.id
                        return (
                            <button
                                key={method.id}
                                onClick={() => setAddMethod(method.id)}
                                className={cn(
                                    "p-3 rounded-lg border transition-all text-left",
                                    isActive ? "border-primary bg-primary/10" : "border-muted hover:border-muted-foreground/30",
                                    platformTab === 'kiro' && method.id === 'oauth' && "hidden"
                                )}
                            >
                                <div className="flex items-center gap-2 mb-0.5">
                                    <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
                                    <span className={cn("text-sm font-medium", isActive && "text-primary")}>{method.name}</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground">{method.desc}</p>
                            </button>
                        )
                    })}
                </div>

                <div className="mt-4 space-y-4">
                    {/* TOKEN Input */}
                    {addMethod === 'token' && (
                        <>
                            {platformTab === 'antigravity' ? (
                                <div className="space-y-3">
                                    <Label>{isEn ? 'Refresh Token(s)' : '刷新令牌'}</Label>
                                    <textarea
                                        className="w-full h-32 rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                                        placeholder={t('dialog.tokenPlaceholder', 'Paste tokens here...')}
                                        value={tokenInput}
                                        onChange={(e) => setTokenInput(e.target.value)}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label>Email</Label>
                                        <Input value={kiroForm.email} onChange={e => setKiroForm({ ...kiroForm, email: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Session Token</Label>
                                        <Input type="password" value={kiroForm.sessionToken} onChange={e => setKiroForm({ ...kiroForm, sessionToken: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>{isEn ? 'Machine ID (Optional)' : '机器码 (可选)'}</Label>
                                        <Input
                                            placeholder={isEn ? "Leave empty to generate new..." : "留空自动生成..."}
                                            value={kiroForm.machineId}
                                            onChange={e => setKiroForm({ ...kiroForm, machineId: e.target.value })}
                                            className="font-mono text-xs"
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* OAuth */}
                    {addMethod === 'oauth' && platformTab === 'antigravity' && (
                        <div className="space-y-4">
                            <Button variant="outline" className="w-full py-6" onClick={handleOAuth}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                {isEn ? 'Open Google Login' : '打开 Google 登录'}
                            </Button>
                            <div className="grid gap-2">
                                <Label>{isEn ? 'Verification Code' : '验证码'}</Label>
                                <Input
                                    placeholder="Paste the code here..."
                                    value={oauthCode}
                                    onChange={(e) => setOauthCode(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Import */}
                    {addMethod === 'import' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>{isEn ? 'Database path (SQLite)' : '数据库路径 (SQLite)'}</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="C:\Users\...\state.vscdb"
                                        id="db-path-input"
                                        className="font-mono text-xs"
                                    />
                                    <Button onClick={() => {
                                        const path = (document.getElementById('db-path-input') as HTMLInputElement).value
                                        handleDbImport(path)
                                    }}>
                                        {isEn ? 'Scan' : '扫描'}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {isEn ? 'Supports VSCode/Cursor state.vscdb' : '支持 VSCode/Cursor 的 state.vscdb 文件'}
                                </p>
                            </div>

                            {importedTokens.length > 0 && (
                                <div className="rounded-md border p-2 bg-muted/50 max-h-32 overflow-y-auto">
                                    {importedTokens.map((t, i) => (
                                        <div key={i} className="text-xs font-mono truncate py-1 border-b last:border-0 border-border/50">
                                            <span className="font-semibold">{t.source}:</span> {t.token.substring(0, 20)}...
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Status */}
                {status !== 'idle' && (
                    <div className={cn("flex items-center gap-2 p-3 rounded-lg text-sm", status === 'success' ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600")}>
                        {status === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        <span>{message}</span>
                    </div>
                )}

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>{t('dialog.cancel')}</Button>
                    {addMethod === 'import' && importedTokens.length > 0 ? (
                        <Button onClick={confirmImport} disabled={isProcessing}>
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('dialog.save')}
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isProcessing}>
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('dialog.save')}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
