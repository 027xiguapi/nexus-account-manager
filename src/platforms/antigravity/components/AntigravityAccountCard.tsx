import { memo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QuotaItem } from '@/components/accounts/QuotaItem'
import { AntigravityAccountDetailsDialog } from './AntigravityAccountDetailsDialog'
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog'
import { cn, getSubscriptionDisplayName, getSubscriptionStyle } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { usePlatformStore } from '@/stores/usePlatformStore'
import { AntigravityAccountService } from '../services/AntigravityAccountService'
import type { AntigravityAccount } from '@/types/account'
import {
    RefreshCw,
    Trash2,
    Copy,
    Power,
    Info,
    Check,
    Download,
    Ban,
    Gem,
    Diamond,
    Circle
} from 'lucide-react'

interface AntigravityAccountCardProps {
    account: AntigravityAccount
    onExport?: () => void
}

const getSubscriptionIcon = (tier?: string) => {
    const t = (tier || '').toLowerCase()
    if (t.includes('ultra')) return <Gem className="w-3 h-3 fill-current" />
    if (t.includes('pro')) return <Diamond className="w-3 h-3 fill-current" />
    return <Circle className="w-3 h-3" />
}

export const AntigravityAccountCard = memo(function AntigravityAccountCard({
    account,
    onExport,
}: AntigravityAccountCardProps) {
    const { t } = useTranslation()
    const [copied, setCopied] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const deleteAccount = usePlatformStore(state => state.deleteAccount)

    const subscriptionTier = account.quota?.subscription_tier || 'FREE'
    const isForbidden = account.is_forbidden || account.quota?.is_forbidden

    const handleCopyEmail = async () => {
        await navigator.clipboard.writeText(account.email)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        try {
            await AntigravityAccountService.refreshAccount(account)
        } catch (e) {
            console.error('Failed to refresh:', e)
        } finally {
            setIsRefreshing(false)
        }
    }

    const handleSwitch = async () => {
        try {
            await AntigravityAccountService.switchAccount(account.id)
        } catch (e) {
            console.error('Failed to switch account:', e)
        }
    }

    const handleDelete = async () => {
        deleteAccount(account.id)
    }

    return (
        <>
            <Card
                className={cn(
                    'relative transition-all duration-300 cursor-pointer overflow-hidden group border-border/60',
                    'bg-card shadow-sm',
                    'hover:shadow-lg hover:-translate-y-1 hover:border-primary/20',
                    account.isActive && 'ring-2 ring-primary shadow-lg shadow-primary/10 bg-primary/5',
                    isForbidden && 'border-destructive/30 bg-destructive/5'
                )}
            >
                {/* Banned Badge */}
                {isForbidden && (
                    <div className="absolute top-0 right-0 bg-destructive/90 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-medium flex items-center gap-1 z-20">
                        <Ban className="w-3 h-3" />
                        BANNED
                    </div>
                )}

                {/* Active Indicator */}
                {account.isActive && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                )}

                <CardContent className="p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3
                                    className={cn(
                                        "font-semibold text-sm truncate cursor-pointer transition-colors",
                                        copied ? "text-green-500" : "hover:text-primary"
                                    )}
                                    onClick={handleCopyEmail}
                                    title={account.email}
                                >
                                    {copied ? t('common.copied') : account.email}
                                </h3>
                                {account.isActive && (
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                )}
                            </div>
                            {account.name && (
                                <p className="text-xs text-muted-foreground truncate">
                                    {account.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={cn('text-[10px] h-5 px-2 border-0 shadow-sm', getSubscriptionStyle(subscriptionTier))}>
                            {getSubscriptionIcon(subscriptionTier)}
                            <span className="ml-1.5 font-medium">{getSubscriptionDisplayName(subscriptionTier)}</span>
                        </Badge>
                        <Badge variant="outline" className="text-[10px] h-5 px-2 text-muted-foreground">
                            Antigravity
                        </Badge>
                    </div>

                    {/* Quota Display */}
                    {account.quota && (
                        <div className="space-y-1.5 pt-1">
                            {isForbidden ? (
                                <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/10 p-2 rounded-lg border border-red-200 dark:border-red-900/30">
                                    <Ban className="w-4 h-4 shrink-0" />
                                    <span>Account Forbidden</span>
                                </div>
                            ) : (
                                <div className="space-y-1.5">
                                    {account.quota.models?.slice(0, 3).map((model) => (
                                        <QuotaItem
                                            key={model.name}
                                            label={model.name}
                                            percentage={model.percentage}
                                            resetTime={model.reset_time}
                                        />
                                    ))}
                                    {account.quota.models && account.quota.models.length > 3 && (
                                        <div className="text-[10px] text-muted-foreground/50 text-center">
                                            +{account.quota.models.length - 3} more models
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-0.5">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={handleSwitch}
                                disabled={account.isActive}
                                title={t('common.switch')}
                            >
                                <Power className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                title={t('common.refresh')}
                            >
                                <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={handleCopyEmail}
                                title={t('common.copy')}
                            >
                                {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={onExport}
                                title={t('common.export')}
                            >
                                <Download className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-0.5">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() => setDetailsOpen(true)}
                                title={t('common.details')}
                            >
                                <Info className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 hover:bg-red-500/10 hover:text-red-500"
                                onClick={() => setDeleteConfirmOpen(true)}
                                title={t('common.delete')}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <AntigravityAccountDetailsDialog
                account={account}
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
            />

            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                title={t('common.delete')}
                description={t('common.confirmDelete', { name: account.email })}
                confirmText={t('common.delete')}
                cancelText={t('common.cancel')}
                variant="destructive"
                onConfirm={handleDelete}
            />
        </>
    )
})
