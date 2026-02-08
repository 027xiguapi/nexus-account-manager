import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { AddAccountDialog } from '@/components/dialogs/AddAccountDialog'
import { Button } from '@/components/ui/Button'
import { usePlatformStore } from '@/stores/usePlatformStore'
import { useMemo } from 'react'
import { AntigravityAccount } from '@/types/account'

export function AntigravityAccountList() {
  const accounts = usePlatformStore((state) => state.accounts)

  // Use useMemo with type predicate to filter accounts
  const antigravityAccounts = useMemo(
    () => accounts.filter((acc): acc is AntigravityAccount => acc.platform === 'antigravity'),
    [accounts]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Antigravity Accounts</h2>
          <p className="text-muted-foreground mt-1">
            Manage your Google/Anthropic AI service accounts
          </p>
        </div>
        <AddAccountDialog />
      </div>

      {antigravityAccounts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No accounts yet</p>
            <AddAccountDialog />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {antigravityAccounts.map((account) => (
            <Card key={account.id}>
              <CardHeader>
                <CardTitle className="text-lg">{account.name || 'Unnamed Account'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">{account.email}</p>

                  {/* Quota Display (Mock) */}
                  {account.quota?.models && account.quota.models.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Usage: {account.quota.models[0].percentage}%
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="secondary">
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost">
                      Switch
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
