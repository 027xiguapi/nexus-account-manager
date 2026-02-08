import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { useState } from 'react'
import { usePlatformStore } from '@/stores/usePlatformStore'
import { Plus, CheckCircle2 } from 'lucide-react'
import { AntigravityAccount, KiroAccount } from '@/types/account'
import { useTranslation } from 'react-i18next'

export function AddAccountDialog() {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)
    const addAccount = usePlatformStore(state => state.addAccount)
    const [activeTab, setActiveTab] = useState('antigravity')

    // Form States
    const [antigravityForm, setAntigravityForm] = useState({
        name: '',
        email: '',
        accessToken: '',
        refreshToken: '',
        proxy: ''
    })

    const [kiroForm, setKiroForm] = useState({
        name: '',
        email: '',
        sessionToken: '',
        machineId: ''
    })

    const [isValidating, setIsValidating] = useState(false)

    const handleSubmit = async () => {
        // Basic formatting and logic (simulated validation)
        setIsValidating(true)
        await new Promise(resolve => setTimeout(resolve, 500))
        setIsValidating(false)

        if (activeTab === 'antigravity') {
            if (!antigravityForm.email || !antigravityForm.accessToken) return

            const newAccount: Partial<AntigravityAccount> = {
                platform: 'antigravity',
                email: antigravityForm.email,
                name: antigravityForm.name || antigravityForm.email.split('@')[0],
                isActive: false,
                token: {
                    access_token: antigravityForm.accessToken,
                    refresh_token: antigravityForm.refreshToken,
                    expires_in: 3600,
                    expiry_timestamp: Date.now() + 3600 * 1000,
                    token_type: 'Bearer',
                },
                quota: {
                    models: [],
                    subscription_tier: 'FREE',
                    last_updated: Date.now(),
                    is_forbidden: false
                },
                device_profile: {
                    machine_id: window.crypto.randomUUID(),
                    mac_machine_id: 'mock_mac_id',
                    dev_device_id: 'mock_dev_id',
                    sqm_id: 'mock_sqm_id'
                },
                is_forbidden: false,
            }
            if (antigravityForm.proxy) {
                newAccount.proxy_id = antigravityForm.proxy;
            }
            await addAccount(newAccount as AntigravityAccount)
        } else {
            if (!kiroForm.email || !kiroForm.sessionToken) return

            const newAccount: Partial<KiroAccount> = {
                platform: 'kiro',
                email: kiroForm.email,
                name: kiroForm.name || kiroForm.email.split('@')[0],
                isActive: false,
                idp: 'Google',
                machineId: kiroForm.machineId || undefined,
                subscription: { type: 'Free', expiresAt: undefined },
                usage: { current: 0, limit: 1000, percentUsed: 0 },
            }
            // Inject session token into platformData if needed by backend, 
            // but for now strict types don't allow it on the top level Partial<Account> unless cast.
            // We will assume the store handles the internal "platform_data" field construction.
            // Or if we need to pass it, we should cast.
            const accountToSave = {
                ...newAccount,
                platformData: { sessionToken: kiroForm.sessionToken }
            }
            await addAccount(accountToSave as KiroAccount)
        }
        setOpen(false)
        // Reset
        setAntigravityForm({ name: '', email: '', accessToken: '', refreshToken: '', proxy: '' })
        setKiroForm({ name: '', email: '', sessionToken: '', machineId: '' })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="primary">
                    <Plus className="mr-2 h-4 w-4" />
                    {t('accounts.add')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-border bg-card text-card-foreground shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{t('dialog.addAccount')}</DialogTitle>
                </DialogHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-muted p-1">
                        <TabsTrigger value="antigravity" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                            {t('dialog.tabs.antigravity')}
                        </TabsTrigger>
                        <TabsTrigger value="kiro" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                            {t('dialog.tabs.kiro')}
                        </TabsTrigger>
                    </TabsList>

                    <div className="mt-6 space-y-4 px-1">
                        {activeTab === 'antigravity' ? (
                            <TabsContent value="antigravity" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="grid gap-2">
                                    <Label htmlFor="ag-email">{t('dialog.email')}</Label>
                                    <Input
                                        id="ag-email"
                                        placeholder="user@example.com"
                                        value={antigravityForm.email}
                                        onChange={e => setAntigravityForm({ ...antigravityForm, email: e.target.value })}
                                        className="bg-background"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="ag-name">{t('dialog.name')}</Label>
                                    <Input
                                        id="ag-name"
                                        placeholder="My Account"
                                        value={antigravityForm.name}
                                        onChange={e => setAntigravityForm({ ...antigravityForm, name: e.target.value })}
                                        className="bg-background"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="ag-token">{t('dialog.accessToken')} <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="ag-token"
                                        type="password"
                                        placeholder="ya29..."
                                        value={antigravityForm.accessToken}
                                        onChange={e => setAntigravityForm({ ...antigravityForm, accessToken: e.target.value })}
                                        className="font-mono text-xs bg-background"
                                    />
                                    <p className="text-[10px] text-muted-foreground">Required for API calls.</p>
                                </div>
                            </TabsContent>
                        ) : (
                            <TabsContent value="kiro" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="grid gap-2">
                                    <Label htmlFor="k-email">{t('dialog.email')}</Label>
                                    <Input
                                        id="k-email"
                                        placeholder="user@example.com"
                                        value={kiroForm.email}
                                        onChange={e => setKiroForm({ ...kiroForm, email: e.target.value })}
                                        className="bg-background"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="k-session">{t('dialog.sessionToken')} <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="k-session"
                                        type="password"
                                        placeholder="session_..."
                                        value={kiroForm.sessionToken}
                                        onChange={e => setKiroForm({ ...kiroForm, sessionToken: e.target.value })}
                                        className="font-mono text-xs bg-background"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="k-mid">Machine ID (Optional)</Label>
                                    <Input
                                        id="k-mid"
                                        placeholder="Enter existing machine ID to bind..."
                                        value={kiroForm.machineId}
                                        onChange={e => setKiroForm({ ...kiroForm, machineId: e.target.value })}
                                        className="font-mono text-xs bg-background"
                                    />
                                    <p className="text-[10px] text-muted-foreground">Leave empty to generate a new one.</p>
                                </div>
                            </TabsContent>
                        )}
                    </div>
                </Tabs>
                <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={() => setOpen(false)}>{t('dialog.cancel')}</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={isValidating}>
                        {isValidating && <CheckCircle2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('dialog.save')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
