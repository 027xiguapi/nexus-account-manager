/**
 * 统一账号添加对话框
 * 
 * 根据平台配置动态加载添加方式
 */

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePlatformStore } from '@/stores/usePlatformStore'
import { getAllPlatforms, getPlatform } from '@/platforms/registry'
import { cn } from '@/lib/utils'
import type { Account } from '@/types/platform'

interface AddAccountDialogProps {
    defaultPlatform?: string
}

export function AddAccountDialog({ defaultPlatform }: AddAccountDialogProps) {
    const { t } = useTranslation()
    const platforms = getAllPlatforms()

    const [open, setOpen] = useState(false)
    const [selectedPlatform, setSelectedPlatform] = useState(defaultPlatform || platforms[0]?.id || 'antigravity')
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

    const { addAccount, loadAllAccounts } = usePlatformStore()

    // 获取当前平台配置
    const platform = getPlatform(selectedPlatform)
    const methods = platform?.addMethods || []

    // 平台切换时重置方法选择
    const handlePlatformChange = (platformId: string) => {
        setSelectedPlatform(platformId)
        setSelectedMethod(null)
    }

    // 添加成功回调
    const handleSuccess = async (account: Account) => {
        await addAccount(account)
        await loadAllAccounts()
    }

    // 添加失败回调
    const handleError = (error: string) => {
        console.error('Add account error:', error)
    }

    // 关闭对话框
    const handleClose = () => {
        setOpen(false)
        setSelectedMethod(null)
    }

    // 渲染添加方式选择器
    const renderMethodSelector = () => (
        <div className="grid grid-cols-3 gap-2">
            {methods.map((method) => {
                const Icon = method.icon
                const isActive = selectedMethod === method.id

                return (
                    <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={cn(
                            "p-3 rounded-lg border transition-all text-left",
                            isActive
                                ? "border-primary bg-primary/10"
                                : "border-muted hover:border-muted-foreground/30"
                        )}
                    >
                        <div className="flex items-center gap-2 mb-0.5">
                            <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
                            <span className={cn("text-sm font-medium", isActive && "text-primary")}>
                                {method.name}
                            </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">
                            {method.description}
                        </p>
                    </button>
                )
            })}
        </div>
    )

    // 渲染选中的添加方式组件
    const renderMethodContent = () => {
        if (!selectedMethod) {
            return (
                <div className="text-center py-8 text-muted-foreground text-sm">
                    {t('dialog.selectMethod', '请选择添加方式')}
                </div>
            )
        }

        const method = methods.find(m => m.id === selectedMethod)
        if (!method) return null

        const MethodComponent = method.component

        return (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <MethodComponent
                    platform={selectedPlatform}
                    onSuccess={handleSuccess}
                    onError={handleError}
                    onClose={handleClose}
                />
            </div>
        )
    }

    return (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSelectedMethod(null) }}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Plus className="mr-2 h-4 w-4" />
                    {t('accounts.add')}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[550px] border-border bg-card text-card-foreground shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {t('dialog.addAccount')}
                    </DialogTitle>
                </DialogHeader>

                {/* 平台选择 */}
                <Tabs value={selectedPlatform} onValueChange={handlePlatformChange} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-muted p-1">
                        {platforms.map((p) => {
                            const Icon = p.icon
                            return (
                                <TabsTrigger
                                    key={p.id}
                                    value={p.id}
                                    className="gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                                >
                                    <Icon className="h-4 w-4" />
                                    {p.name}
                                </TabsTrigger>
                            )
                        })}
                    </TabsList>
                </Tabs>

                {/* 添加方式选择 */}
                <div className="mt-4">
                    {renderMethodSelector()}
                </div>

                {/* 添加方式内容 */}
                <div className="mt-4 min-h-[200px]">
                    {renderMethodContent()}
                </div>
            </DialogContent>
        </Dialog>
    )
}
