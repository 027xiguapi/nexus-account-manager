import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { KiroAccount } from '@/types/account'

interface SubscriptionCardProps {
    accounts: KiroAccount[]
}

export function SubscriptionCard({ accounts }: SubscriptionCardProps) {
    const stats = accounts.reduce((acc, curr) => {
        const type = curr.subscription.type || 'Free'
        acc[type] = (acc[type] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Subscription Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {Object.entries(stats).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{type}</span>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary"
                                        style={{ width: `${(count / accounts.length) * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm font-medium">{count}</span>
                            </div>
                        </div>
                    ))}
                    {accounts.length === 0 && (
                        <p className="text-xs text-muted-foreground">No Kiro accounts</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
