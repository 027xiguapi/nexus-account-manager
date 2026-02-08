import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KiroAccount } from '@/types/account'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface SubscriptionCardProps {
    accounts: KiroAccount[]
    className?: string
}

export function SubscriptionCard({ accounts, className }: SubscriptionCardProps) {
    const { t } = useTranslation()
    const stats = accounts.reduce((acc, curr) => {
        const type = curr.subscription.type || 'Free'
        acc[type] = (acc[type] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    return (
        <Card className={cn(
            "bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-white/5",
            "hover:shadow-lg hover:shadow-primary/5 transition-all duration-300",
            className
        )}>
            <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground/80">
                    {t('dashboard.subscriptionDistribution')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {Object.entries(stats).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between group">
                            <span className="text-sm text-foreground/80 font-medium">{type}</span>
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-32 bg-secondary/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 group-hover:brightness-110"
                                        style={{ width: `${(count / accounts.length) * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm font-mono text-muted-foreground w-4 text-right">{count}</span>
                            </div>
                        </div>
                    ))}
                    {accounts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-6 text-muted-foreground text-sm opacity-60">
                            <p>{t('dashboard.noKiroAccounts')}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
