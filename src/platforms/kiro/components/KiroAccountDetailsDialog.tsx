import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { KiroAccount } from '@/types/account'
import { cn } from '@/lib/utils'

interface KiroAccountDetailsDialogProps {
    account: KiroAccount
    open: boolean
    onClose: () => void
}

export function KiroAccountDetailsDialog({ account, open, onClose }: KiroAccountDetailsDialogProps) {
    const { t } = useTranslation()
    const [copiedField, setCopiedField] = useState<string | null>(null)

    const handleCopy = async (text: string, field: string) => {
        await navigator.clipboard.writeText(text)
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 1500)
    }

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString()
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t('accounts.details')}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground">{t('accounts.basicInfo')}</h3>
                        
                        <div className="grid gap-3">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('accounts.email')}</p>
                                    <p className="text-sm font-mono">{account.email}</p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleCopy(account.email, 'email')}
                                >
                                    {copiedField === 'email' ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>

                            {account.name && (
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">{t('accounts.name')}</p>
                                        <p className="text-sm">{account.name}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('accounts.platform')}</p>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{account.idp || 'Kiro'}</Badge>
                                        <Badge variant="outline">{account.credentials.authMethod}</Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('accounts.status')}</p>
                                    <Badge className={cn(
                                        account.status === 'active' && 'bg-green-500',
                                        account.status === 'error' && 'bg-red-500',
                                        account.status === 'banned' && 'bg-red-600',
                                        account.status === 'refreshing' && 'bg-blue-500'
                                    )}>
                                        {account.status?.toUpperCase() || 'ACTIVE'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Info */}
                    {account.subscription && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-muted-foreground">{t('accounts.subscription')}</h3>
                            
                            <div className="grid gap-3">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">{t('accounts.type')}</p>
                                        <p className="text-sm font-semibold">{account.subscription.type}</p>
                                    </div>
                                </div>

                                {account.subscription.title && (
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">{t('accounts.title')}</p>
                                            <p className="text-sm">{account.subscription.title}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Usage Info */}
                    {account.usage && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-muted-foreground">{t('accounts.usage')}</h3>
                            
                            <div className="grid gap-3">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">{t('accounts.current')}</p>
                                        <p className="text-sm font-mono">{account.usage.current} / {account.usage.limit}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">{t('accounts.percentUsed')}</p>
                                        <p className="text-sm font-mono">{(account.usage.percentUsed * 100).toFixed(1)}%</p>
                                    </div>
                                </div>

                                {account.usage.lastUpdated && (
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">{t('accounts.lastUpdated')}</p>
                                            <p className="text-sm">{formatDate(account.usage.lastUpdated)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Credentials Info */}
                    {account.credentials && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-muted-foreground">{t('accounts.credentials')}</h3>
                            
                            <div className="grid gap-3">
                                {account.credentials.clientId && (
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <div className="space-y-1 flex-1 min-w-0">
                                            <p className="text-xs text-muted-foreground">Client ID</p>
                                            <p className="text-sm font-mono truncate">{account.credentials.clientId}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleCopy(account.credentials.clientId!, 'clientId')}
                                        >
                                            {copiedField === 'clientId' ? (
                                                <Check className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                )}

                                {account.credentials.region && (
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">{t('accounts.region')}</p>
                                            <p className="text-sm font-mono">{account.credentials.region}</p>
                                        </div>
                                    </div>
                                )}

                                {account.credentials.expiresAt && (
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">{t('accounts.expiresAt')}</p>
                                            <p className="text-sm">{formatDate(account.credentials.expiresAt)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Timestamps */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground">{t('accounts.timestamps')}</h3>
                        
                        <div className="grid gap-3">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('accounts.createdAt')}</p>
                                    <p className="text-sm">{formatDate(account.createdAt)}</p>
                                </div>
                            </div>

                            {account.lastUsedAt && (
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">{t('accounts.lastUsedAt')}</p>
                                        <p className="text-sm">{formatDate(account.lastUsedAt)}</p>
                                    </div>
                                </div>
                            )}

                            {account.lastCheckedAt && (
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">{t('accounts.lastCheckedAt')}</p>
                                        <p className="text-sm">{formatDate(account.lastCheckedAt)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
