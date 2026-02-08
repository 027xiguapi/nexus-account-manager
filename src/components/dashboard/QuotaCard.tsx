import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { AntigravityAccount } from '@/types/account'
import { Progress } from '@/components/ui/Progress'

interface QuotaCardProps {
    accounts: AntigravityAccount[]
}

export function QuotaCard({ accounts }: QuotaCardProps) {
    // Calculate average quota usage
    const totalQuota = accounts.reduce((acc, curr) => {
        const model = curr.quota?.models[0] // Assuming first model for now
        return acc + (model?.percentage || 0)
    }, 0)

    const avgQuota = accounts.length > 0 ? Math.round(totalQuota / accounts.length) : 0

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Average Quota Usage</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold mb-2">{avgQuota}%</div>
                <Progress value={avgQuota} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                    Across {accounts.length} Antigravity accounts
                </p>
            </CardContent>
        </Card>
    )
}
