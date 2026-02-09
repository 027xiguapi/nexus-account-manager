import { useState } from 'react'
import { AddAccountDialog } from './AddAccountDialog'
import { ExportDialog } from '@/components/dialogs/ExportDialog'
import { AccountCard } from '@/components/accounts/AccountCard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { usePlatformStore } from '@/stores/usePlatformStore'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Download } from 'lucide-react'
import type { Account } from '@/types/account'

export function GeminiAccountList() {
  const { t } = useTranslation()
  const accounts = usePlatformStore((state) => state.accounts)
  const [exportOpen, setExportOpen] = useState(false)

  const geminiAccounts = useMemo(
    () => accounts.filter((acc): acc is Account => acc.platform === 'gemini' as any),
    [accounts]
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Google Gemini
          </h2>
          <p className="text-muted-foreground mt-2 text-lg font-light">
            {t('platforms.gemini.description', 'Manage your Google Gemini API accounts')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {geminiAccounts.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExportOpen(true)}
              className="bg-background/50 backdrop-blur-sm border-white/10 hover:bg-background/80"
            >
              <Download className="h-4 w-4 mr-2" />
              {t('common.export')}
            </Button>
          )}
          <div className="relative z-10">
            <AddAccountDialog />
          </div>
        </div>
      </div>

      {geminiAccounts.length === 0 ? (
        <Card className="bg-card/30 border-dashed border-2 border-muted hover:border-muted-foreground/50 transition-colors">
          <CardContent className="flex flex-col items-center justify-center py-24">
            <div className="p-4 rounded-full bg-background/50 mb-4 ring-1 ring-white/10">
              <div className="h-8 w-8 rounded-full bg-primary/20 animate-pulse" />
            </div>
            <p className="text-lg font-medium mb-2">{t('accounts.noAccounts', 'No accounts yet')}</p>
            <p className="text-sm text-muted-foreground mb-6">Get started by adding your first account</p>
            <AddAccountDialog />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {geminiAccounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onExport={() => setExportOpen(true)}
            />
          ))}
        </div>
      )}

      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        accounts={geminiAccounts}
      />
    </div>
  )
}
