import { memo, useState } from 'react'
import { AccountCard } from '@/components/accounts/AccountCardBase'
import { Badge } from '@/components/ui/badge'
import { ClaudeAccountDetailsDialog } from './ClaudeAccountDetailsDialog'
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { usePlatformStore } from '@/stores/usePlatformStore'
import type { ClaudeAccount } from '@/types/account'

interface ClaudeAccountCardProps {
  account: ClaudeAccount
  onExport?: () => void
  onEdit?: () => void
}

export const ClaudeAccountCard = memo(function ClaudeAccountCard({
  account,
  onExport,
  onEdit,
}: ClaudeAccountCardProps) {
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
            Claude
          </Badge>
        }
        onSwitch={handleSwitch}
        onExport={onExport}
        onDetails={() => setDetailsOpen(true)}
        onDelete={() => setDeleteConfirmOpen(true)}
        customActions={onEdit ? [{
          icon: require('lucide-react').Edit,
          label: t('common.edit'),
          onClick: onEdit
        }] : []}
      />

      <ClaudeAccountDetailsDialog
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
