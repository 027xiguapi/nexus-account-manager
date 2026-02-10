import { memo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { KiroAccountDetailsDialog } from './KiroAccountDetailsDialog'
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { usePlatformStore } from '@/stores/usePlatformStore'
import { KiroAccountService } from '../services/KiroAccountService'
import type { KiroAccount } from '@/types/account'
import {
    RefreshCw,
    Trash2,
    Copy,
    Power,
    Info,
    Check,
    Download,
    Loader2,
    Gem,
    Diamond,
    Circle
} from 'lucide-react'

interface KiroAccountCardProps {
    account: KiroAccount
    onExport?: () => void
}

const getSubscriptionIcon = (type?: string) => {
    const t = (type || '').toLowerCase()
    if (t.includes('pro') && t.includes('plus')) return <Gem className="w-3 h-3 fill-current" />
    if (t.includes('pro')) return <Diamond className="w-3 h-3 fill-current" />
    return <Circle className="w-3 h-3" />
}

const getSubscriptionStyle = (type?: string) => {
    const t = (type || '').toLowerCase()
    if (t.includes('pro') && t.includes('plus')) return 'bg-purple-600 text-white border-purple-600'
    if (t.includes('pro')) return 'bg-blue-600 text-white border-blue-600'
    return 'bg-secondary text-secondary-foreground'
}

export const KiroAccountCard = memo(function KiroAccountCard({
    account,
    onExport,
}: KiroAccountCardProps) {
    const { t } = useTranslation()
    const [copied, setCopied] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const deleteAccount = usePlatformStore(state => state.deleteAccount)

    const subscriptionType = account.subscription?.type || 'Free'
    const usagePercent = (account.usage?.percentUsed || 0) * 100
    const isBanned = account.status === 'banned'
    const isError = account.status === 'error'

    const handleCopyEmail = async () => {
        await navigator.clipboard.writeText(account.email)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        try {
            await KiroAccountService.refreshToken(account)
        } catch (e) {
            console.error('Failed to refresh:', e)
        } finally {
            setIsRefreshing(false)
        }
    }

    const handleSwitch = async () => {
        try {
            await KiroAccountService.switchAccount(account.id)
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
                    (isBanned || isError) && 'border-destructive/30 bg-destructive/5'
                )}
            >
                {/* Banned/Error Badge */}
                {(isBanned || isError) && (
                    <div className="absolute top-0 right-0 bg-destructive/90 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-medium flex items-center gap-1 z-20">
                        {isBanned ? 'BANNED' : 'ERROR'}
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
                        <Badge className={cn('text-[10px] h-5 px-2 border-0 shadow-sm', getSubscriptionStyle(subscriptionType))}>
                            {getSubscriptionIcon(subscriptionType)}
                            <span className="ml-1.5 font-medium">{subscriptionType.toUpperCase()}</span>
                        </Badge>
                        <Badge variant="outline" className="text-[10px] h-5 px-2 text-muted-foreground">
                            {account.idp || 'Kiro'}
                        </Badge>
                        {account.status === 'refreshing' && (
                            <Badge variant="outline" className="text-[10px] h-5 px-2 bg-blue-500/10 text-blue-600 border-0">
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                REFRESHING
                            </Badge>
                        )}
                    </div>

                    {/* Usage Display */}
                    {account.usage && (
                        <div className="space-y-2 pt-1">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">{t('accounts.usage')}</span>
                                <span className={cn(
                                    "font-mono font-medium",
                                    usagePercent > 80 ? "text-amber-500" : "text-foreground/80"
                                )}>
                                    {usagePercent.toFixed(0)}%
                                </span>
                            </div>
                            <Progress
                                value={usagePercent}
                                className="h-1.5 bg-secondary/50"
                                indicatorClassName={cn(
                                    "transition-all duration-500",
                                    usagePercent > 90 ? "bg-red-500" :
                                        usagePercent > 70 ? "bg-amber-500" : "bg-primary"
                                )}
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground/70">
                                <span>{account.usage.current} / {account.usage.limit}</span>
                                {account.usage.lastUpdated && (
                                    <span>{new Date(account.usage.lastUpdated).toLocaleDateString()}</span>
                                )}
                            </div>
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

            <KiroAccountDetailsDialog
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
