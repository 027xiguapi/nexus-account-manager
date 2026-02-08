import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import type { Account, AntigravityAccount, KiroAccount } from '@/types/account'
import {
    X, Copy, Check, Mail, User, Shield, Clock,
    Cpu, Network, CreditCard, AlertTriangle, Gem, Diamond
} from 'lucide-react'

interface AccountDetailsDialogProps {
    account: Account | null
    open: boolean
    onClose: () => void
}

export function AccountDetailsDialog({ account, open, onClose }: AccountDetailsDialogProps) {
    const { t } = useTranslation()
    const [copiedField, setCopiedField] = useState<string | null>(null)

    if (!open || !account) return null

    const isAntigravity = account.platform === 'antigravity'
    const antigravity = isAntigravity ? account as AntigravityAccount : null
    const kiro = !isAntigravity ? account as KiroAccount : null

    const handleCopy = async (value: string, field: string) => {
        await navigator.clipboard.writeText(value)
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 1500)
    }

    const subscriptionTier = antigravity?.quota?.subscription_tier || kiro?.subscription?.type || 'Free'

    const getSubscriptionStyle = (tier: string) => {
        const t = tier.toLowerCase()
        if (t.includes('ultra')) return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
        if (t.includes('pro')) return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
        if (t.includes('enterprise')) return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
        return 'bg-secondary text-secondary-foreground'
    }

    const InfoRow = ({ icon: Icon, label, value, copyable = false }: {
        icon: typeof Mail; label: string; value: string; copyable?: boolean
    }) => (
        <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="h-4 w-4" />
                <span className="text-sm">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm font-mono truncate max-w-[200px]" title={value}>
                    {value || '-'}
                </span>
                {copyable && value && (
                    <button
                        onClick={() => handleCopy(value, label)}
                        className="p-1 hover:bg-muted rounded"
                    >
                        {copiedField === label
                            ? <Check className="h-3.5 w-3.5 text-green-500" />
                            : <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        }
                    </button>
                )}
            </div>
        </div>
    )

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-background/95 backdrop-blur-xl rounded-xl shadow-2xl w-[500px] max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-white/10">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-border/50 bg-muted/20">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20">
                            {account.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="font-semibold text-lg tracking-tight">{account.name || account.email.split('@')[0]}</h2>
                            <p className="text-sm text-muted-foreground font-light">{account.email}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-background/80"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(80vh-88px)]">
                    {/* Status Section */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={cn('border-0 px-2.5 py-0.5', getSubscriptionStyle(subscriptionTier))}>
                            {subscriptionTier.includes('ultra') ? <Gem className="w-3 h-3 mr-1.5" /> :
                                subscriptionTier.includes('pro') ? <Diamond className="w-3 h-3 mr-1.5" /> : null}
                            {subscriptionTier.toUpperCase()}
                        </Badge>
                        {account.isActive && (
                            <Badge className="bg-green-500/90 text-white border-0 shadow-sm shadow-green-500/20">
                                {t('accounts.active')}
                            </Badge>
                        )}
                        {antigravity?.is_forbidden && (
                            <Badge variant="destructive" className="flex items-center gap-1 shadow-sm">
                                <AlertTriangle className="w-3 h-3" />
                                {t('accounts.banned')}
                            </Badge>
                        )}
                        <Badge variant="outline" className="bg-background/50">{isAntigravity ? 'Antigravity' : kiro?.idp || 'Kiro'}</Badge>
                    </div>

                    {/* Usage Progress */}
                    <div className="space-y-2 p-4 bg-muted/30 rounded-lg border border-white/5">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{t('details.usage')}</span>
                            <span className="font-mono font-medium">
                                {isAntigravity
                                    ? `${antigravity?.quota?.models?.[0]?.percentage || 0}%`
                                    : `${kiro?.usage?.current || 0} / ${kiro?.usage?.limit || 0}`
                                }
                            </span>
                        </div>
                        <Progress
                            value={isAntigravity
                                ? (antigravity?.quota?.models?.[0]?.percentage || 0)
                                : ((kiro?.usage?.percentUsed || 0) * 100)
                            }
                            className="h-2 bg-background/50"
                        />
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-1">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-3 ml-1">{t('details.basicInfo')}</h3>
                        <div className="bg-muted/30 rounded-lg border border-white/5 overflow-hidden">
                            <InfoRow icon={Mail} label={t('details.email')} value={account.email} copyable />
                            <InfoRow icon={User} label={t('details.name')} value={account.name || ''} />
                            <InfoRow
                                icon={Clock}
                                label={t('details.lastUsed')}
                                value={new Date(account.lastUsedAt).toLocaleString()}
                            />
                            <InfoRow
                                icon={Clock}
                                label={t('details.created')}
                                value={new Date(account.createdAt).toLocaleString()}
                            />
                        </div>
                    </div>

                    {/* Platform Specific */}
                    {isAntigravity && antigravity && (
                        <div className="space-y-1">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-3 ml-1">{t('details.tokenDevice')}</h3>
                            <div className="bg-muted/30 rounded-lg border border-white/5 overflow-hidden">
                                <InfoRow
                                    icon={Shield}
                                    label="Refresh Token"
                                    value={antigravity.token?.refresh_token
                                        ? antigravity.token.refresh_token.substring(0, 20) + '...'
                                        : ''
                                    }
                                    copyable
                                />
                                <InfoRow
                                    icon={Cpu}
                                    label="Machine ID"
                                    value={antigravity.device_profile?.machine_id || ''}
                                    copyable
                                />
                                {antigravity.proxy_id && (
                                    <InfoRow icon={Network} label="Proxy" value={antigravity.proxy_id} />
                                )}
                            </div>
                        </div>
                    )}

                    {!isAntigravity && kiro && (
                        <div className="space-y-1">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-3 ml-1">{t('details.kiroDetails')}</h3>
                            <div className="bg-muted/30 rounded-lg border border-white/5 overflow-hidden">
                                <InfoRow icon={Shield} label="IDP" value={kiro.idp || 'Google'} />
                                <InfoRow icon={Cpu} label="Machine ID" value={kiro.machineId || ''} copyable />
                                <InfoRow
                                    icon={CreditCard}
                                    label={t('details.subscription')}
                                    value={kiro.subscription?.type || 'Free'}
                                />
                                {kiro.subscription?.expiresAt && (
                                    <InfoRow
                                        icon={Clock}
                                        label={t('details.expires')}
                                        value={new Date(kiro.subscription.expiresAt).toLocaleDateString()}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    )
}
