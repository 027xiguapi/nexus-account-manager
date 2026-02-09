import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QuotaItem } from '@/components/accounts/QuotaItem'
import { cn, getSubscriptionDisplayName, getSubscriptionStyle } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import type { AntigravityAccount } from '@/types/account'
import {
    X, Copy, Check, Mail, User, Shield, Clock,
    Cpu, AlertTriangle, Gem, Diamond, Circle
} from 'lucide-react'

interface AntigravityAccountDetailsDialogProps {
    account: AntigravityAccount | null
    open: boolean
    onClose: () => void
}

export function AntigravityAccountDetailsDialog({ account, open, onClose }: AntigravityAccountDetailsDialogProps) {
    const { t } = useTranslation()
    const [copiedField, setCopiedField] = useState<string | null>(null)

    if (!open || !account) return null

    const handleCopy = async (value: string, field: string) => {
        await navigator.clipboard.writeText(value)
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 1500)
    }

    const subscriptionTier = account.quota?.subscription_tier || 'FREE'

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

            <div className="relative bg-background rounded-xl shadow-2xl w-[500px] max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-border">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-muted/20">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-sm">
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
                        className="h-8 w-8"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(80vh-88px)]">
                    {/* Status */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={cn('border-0 px-2.5 py-0.5', getSubscriptionStyle(subscriptionTier))}>
                            {subscriptionTier.toLowerCase().includes('ultra') ? <Gem className="w-3 h-3 mr-1.5 fill-current" /> :
                                subscriptionTier.toLowerCase().includes('pro') ? <Diamond className="w-3 h-3 mr-1.5 fill-current" /> :
                                    <Circle className="w-3 h-3 mr-1.5" />}
                            {getSubscriptionDisplayName(subscriptionTier)}
                        </Badge>
                        {account.isActive && (
                            <Badge className="bg-green-500/90 text-white border-0">
                                {t('accounts.active')}
                            </Badge>
                        )}
                        {account.is_forbidden && (
                            <Badge variant="destructive" className="flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                {t('accounts.banned')}
                            </Badge>
                        )}
                        <Badge variant="outline" className="bg-background/50">Antigravity</Badge>
                    </div>

                    {/* Quota Models */}
                    {account.quota && (
                        <div className="space-y-2 p-4 bg-muted/30 rounded-lg border border-white/5">
                            <div className="flex justify-between text-sm mb-3">
                                <span className="text-muted-foreground">Model Quotas</span>
                                <span className="text-xs text-muted-foreground">
                                    {account.quota.models?.length || 0} models
                                </span>
                            </div>
                            {account.is_forbidden || account.quota.is_forbidden ? (
                                <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-200 dark:border-red-900/30">
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                    <span>Account is forbidden</span>
                                </div>
                            ) : (
                                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                    {account.quota.models?.map((model) => (
                                        <QuotaItem
                                            key={model.name}
                                            label={model.name}
                                            percentage={model.percentage}
                                            resetTime={model.reset_time}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Basic Info */}
                    <div className="space-y-1">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-3 ml-1">
                            {t('details.basicInfo')}
                        </h3>
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

                    {/* Token & Device */}
                    <div className="space-y-1">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-3 ml-1">
                            Token & Device
                        </h3>
                        <div className="bg-muted/30 rounded-lg border border-white/5 overflow-hidden">
                            <InfoRow
                                icon={Shield}
                                label="Refresh Token"
                                value={account.token.refresh_token.substring(0, 20) + '...'}
                                copyable
                            />
                            {account.device_profile && (
                                <InfoRow
                                    icon={Cpu}
                                    label="Machine ID"
                                    value={account.device_profile.machine_id}
                                    copyable
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}
