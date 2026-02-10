import { memo, useState } from 'react'
import { AccountCard } from '@/components/accounts/AccountCardBase'
import { Badge } from '@/components/ui/badge'
import { CodexAccountDetailsDialog } from './CodexAccountDetailsDialog'
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { usePlatformStore } from '@/stores/usePlatformStore'
import type { CodexAccount } from '@/types/account'

interface CodexAccountCardProps {
  account: CodexAccount
  onExport?: () => void
}

export const CodexAccountCard = memo(function CodexAccountCard({
  account,
  onExport,
}: CodexAccountCardProps) {
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
            Codex
          </Badge>
        }
        onSwitch={handleSwitch}
        onExport={onExport}
        onDetails={() => setDetailsOpen(true)}
        onDelete={() => setDeleteConfirmOpen(true)}
      />

      <CodexAccountDetailsDialog
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
