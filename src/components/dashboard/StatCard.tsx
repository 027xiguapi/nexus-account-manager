import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type StatVariant = 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'pink'

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
    variant?: StatVariant
}

const variants: Record<StatVariant, { iconBg: string; iconColor: string; hoverBorder: string }> = {
    default: {
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        hoverBorder: "hover:border-primary/30"
    },
    blue: {
        iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
        iconColor: "text-blue-600 dark:text-blue-400",
        hoverBorder: "hover:border-blue-500/30"
    },
    green: {
        iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        hoverBorder: "hover:border-emerald-500/30"
    },
    purple: {
        iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
        iconColor: "text-purple-600 dark:text-purple-400",
        hoverBorder: "hover:border-purple-500/30"
    },
    orange: {
        iconBg: "bg-orange-500/10 dark:bg-orange-500/20",
        iconColor: "text-orange-600 dark:text-orange-400",
        hoverBorder: "hover:border-orange-500/30"
    },
    pink: {
        iconBg: "bg-pink-500/10 dark:bg-pink-500/20",
        iconColor: "text-pink-600 dark:text-pink-400",
        hoverBorder: "hover:border-pink-500/30"
    }
}

export function StatCard({ title, value, icon: Icon, description, trend, className, variant = 'default' }: StatCardProps) {
    const style = variants[variant]

    return (
        <Card className={cn(
            "relative overflow-hidden transition-all duration-300 border-border/60 bg-card shadow-sm",
            "hover:shadow-lg hover:-translate-y-1",
            style.hoverBorder,
            className
        )}>
            <div className={cn(
                "absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                "bg-gradient-to-br from-transparent via-transparent to-current/5",
                style.iconColor
            )} />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground/80">
                    {title}
                </CardTitle>
                <div className={cn("p-2.5 rounded-xl transition-colors duration-300", style.iconBg, style.iconColor)}>
                    <Icon className="h-5 w-5" />
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
                                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                            )}>
                                {trend.positive ? '↑' : '↓'} {trend.value}%
                            </span>
                        )}
                        <span className="opacity-80 font-medium">{description}</span>
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
