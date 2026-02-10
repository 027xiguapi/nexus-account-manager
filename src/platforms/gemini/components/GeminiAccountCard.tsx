import { memo, useState } from 'react'
import { AccountCard } from '@/components/accounts/AccountCardBase'
import { Badge } from '@/components/ui/badge'
import { GeminiAccountDetailsDialog } from './GeminiAccountDetailsDialog'
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { usePlatformStore } from '@/stores/usePlatformStore'
import type { GeminiAccount } from '@/types/account'

interface GeminiAccountCardProps {
  account: GeminiAccount
  onExport?: () => void
}

export const GeminiAccountCard = memo(function GeminiAccountCard({
  account,
  onExport,
}: GeminiAccountCardProps) {
  const { t } = useTranslation()
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const deleteAccount = usePlatformStore(state => state.deleteAccount)
  const setActiveAccount = usePlatformStore(state => state.setActiveAccount)

  const handleSwitch = () => {
    setActiveAccount(account)
  }

  const handleDelete = async () => {
    deleteAccount(account.id)
  }

  return (
    <>
      <AccountCard
        id={account.id}
        email={account.email}
        name={account.name}
        isActive={account.isActive}
        badges={
          <Badge variant="outline" className="text-[10px] h-5 px-2 text-muted-foreground">
            Gemini
          </Badge>
        }
        onSwitch={handleSwitch}
        onExport={onExport}
        onDetails={() => setDetailsOpen(true)}
        onDelete={() => setDeleteConfirmOpen(true)}
      />

      <GeminiAccountDetailsDialog
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
