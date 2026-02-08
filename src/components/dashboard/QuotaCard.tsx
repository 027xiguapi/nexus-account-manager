import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AntigravityAccount } from '@/types/account'
import { Progress } from '@/components/ui/progress'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface QuotaCardProps {
    accounts: AntigravityAccount[]
    className?: string
}

export function QuotaCard({ accounts, className }: QuotaCardProps) {
    const { t } = useTranslation()
    // Calculate average quota usage
    const totalQuota = accounts.reduce((acc, curr) => {
        const model = curr.quota?.models[0] // Assuming first model for now
        return acc + (model?.percentage || 0)
    }, 0)

    const avgQuota = accounts.length > 0 ? Math.round(totalQuota / accounts.length) : 0

    return (
        <Card className={cn(
            "bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-white/5",
            "hover:shadow-lg hover:shadow-primary/5 transition-all duration-300",
            className
        )}>
            <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground/80">
                    {t('dashboard.averageQuota')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-bold tracking-tight">{avgQuota}%</span>
                </div>
                <Progress
                    value={avgQuota}
                    className="h-2 bg-secondary/50"
                    indicatorClassName={cn(
                        "transition-all duration-500",
                        avgQuota > 90 ? "bg-red-500" :
                            avgQuota > 70 ? "bg-yellow-500" : "bg-primary"
                    )}
                />
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary/50 animate-pulse" />
                    {t('dashboard.acrossAntigravity', { count: accounts.length })}
                </p>
            </CardContent>
        </Card>
    )
}
