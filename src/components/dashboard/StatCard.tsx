import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    description?: string
    trend?: {
        value: number
        label: string
        positive?: boolean
    }
    className?: string
}

export function StatCard({ title, value, icon: Icon, description, trend, className }: StatCardProps) {
    return (
        <Card className={cn(
            "relative overflow-hidden transition-all duration-300 border-white/5 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm",
            "hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1",
            className
        )}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground/80">
                    {title}
                </CardTitle>
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="text-3xl font-bold tracking-tight text-foreground">{value}</div>
                {(description || trend) && (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                        {trend && (
                            <span className={cn(
                                "flex items-center font-medium px-1.5 py-0.5 rounded text-[10px]",
                                trend.positive
                                    ? "bg-green-500/10 text-green-500"
                                    : "bg-red-500/10 text-red-500"
                            )}>
                                {trend.positive ? '+' : ''}{trend.value}%
                            </span>
                        )}
                        <span className="opacity-80 font-light">{description}</span>
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
