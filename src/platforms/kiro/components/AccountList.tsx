import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { AddAccountDialog } from '@/components/dialogs/AddAccountDialog'
import { Button } from '@/components/ui/Button'
import { usePlatformStore } from '@/stores/usePlatformStore'
import { useMemo } from 'react'
import { KiroAccount } from '@/types/account'

export function KiroAccountList() {
  const accounts = usePlatformStore((state) => state.accounts)

  // Use useMemo with type predicate to filter Kiro accounts
  const kiroAccounts = useMemo(
    () => accounts.filter((acc): acc is KiroAccount => acc.platform === 'kiro'),
    [accounts]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Kiro Accounts</h2>
          <p className="text-muted-foreground mt-1">
            Manage your Kiro IDE accounts and licenses
          </p>
        </div>
        <AddAccountDialog />
      </div>

      {kiroAccounts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No accounts yet</p>
            <AddAccountDialog />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {kiroAccounts.map((account) => (
            <Card key={account.id}>
              <CardHeader>
                <CardTitle className="text-lg">{account.name || 'Unnamed Account'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">{account.email}</p>

                  {/* Machine ID Display */}
                  {account.machineId && (
                    <p className="text-xs font-mono bg-secondary/10 p-1 rounded mt-1 truncate">
                      ID: {account.machineId}
                    </p>
                  )}

                  {/* Subscription Status */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${account.subscription?.type === 'Pro' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                      account.subscription?.type === 'Enterprise' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        'bg-gray-500/10 text-gray-500 border-gray-500/20'
                      }`}>
                      {account.subscription?.type || 'Free'}
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="secondary">
                      Manage
                    </Button>
                    <Button size="sm" variant="ghost">
                      Unbind
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
