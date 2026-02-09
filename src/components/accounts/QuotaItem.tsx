import { Clock, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuotaItemProps {
    label: string
    percentage: number
    resetTime?: string
    isProtected?: boolean
    Icon?: React.ComponentType<{ className?: string }>
}

const getQuotaColor = (percentage: number) => {
    if (percentage >= 90) return 'error'
    if (percentage >= 70) return 'warning'
    return 'success'
}

const getBgColorClass = (p: number) => {
    const color = getQuotaColor(p)
    switch (color) {
        case 'success': return 'bg-emerald-500'
        case 'warning': return 'bg-amber-500'
        case 'error': return 'bg-rose-500'
        default: return 'bg-gray-500'
    }
}

const getTextColorClass = (p: number) => {
    const color = getQuotaColor(p)
    switch (color) {
        case 'success': return 'text-emerald-600 dark:text-emerald-400'
        case 'warning': return 'text-amber-600 dark:text-amber-400'
        case 'error': return 'text-rose-600 dark:text-rose-400'
        default: return 'text-gray-500'
    }
}

const formatTimeRemaining = (resetTime: string) => {
    try {
        const resetDate = new Date(resetTime)
        const now = new Date()
        const diff = resetDate.getTime() - now.getTime()
        
        if (diff <= 0) return '0h'
        
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const days = Math.floor(hours / 24)
        
        if (days > 0) return `${days}d`
        return `${hours}h`
    } catch {
        return 'N/A'
    }
}

export function QuotaItem({ label, percentage, resetTime, isProtected, Icon }: QuotaItemProps) {
    return (
        <div className={cn(
            "relative h-[22px] flex items-center px-1.5 rounded-md overflow-hidden",
            "border border-border/50 bg-muted/30"
        )}>
            {/* Background Progress Bar */}
            <div
                className={cn(
                    "absolute inset-y-0 left-0 transition-all duration-700 ease-out opacity-15",
                    getBgColorClass(percentage)
                )}
                style={{ width: `${percentage}%` }}
            />

            {/* Content */}
            <div className="relative z-10 w-full flex items-center text-[10px] font-mono leading-none gap-1.5">
                {/* Model Name */}
                <span className="flex-1 min-w-0 text-muted-foreground font-bold truncate text-left flex items-center gap-1" title={label}>
                    {Icon && <Icon className="w-3 h-3 shrink-0" />}
                    {label}
                </span>

                {/* Reset Time */}
                <div className="w-[58px] flex justify-start shrink-0">
                    {resetTime ? (
                        <span className="flex items-center gap-0.5 font-medium text-muted-foreground/70 truncate">
                            <Clock className="w-2.5 h-2.5 shrink-0" />
                            {formatTimeRemaining(resetTime)}
                        </span>
                    ) : (
                        <span className="text-muted-foreground/30 italic scale-90">N/A</span>
                    )}
                </div>

                {/* Percentage */}
                <span className={cn(
                    "w-[28px] text-right font-bold transition-colors flex items-center justify-end gap-0.5 shrink-0",
                    getTextColorClass(percentage)
                )}>
                    {isProtected && (
                        <Lock className="w-2.5 h-2.5 text-amber-500" />
                    )}
                    {percentage}%
                </span>
            </div>
        </div>
    )
}
