import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import { usePlatformStore } from '@/stores/usePlatformStore'
import { useMemo } from 'react'

export function KiroAccountList() {
  const accounts = usePlatformStore((state) => state.accounts)
  
  // 使用 useMemo 缓存过滤结果
  const kiroAccounts = useMemo(
    () => accounts.filter((acc) => acc.platform === 'kiro'),
    [accounts]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Kiro IDE Accounts</h2>
          <p className="text-[rgb(var(--secondary))] mt-1">
            Manage your Kiro IDE accounts and machine IDs
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>

      {kiroAccounts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-[rgb(var(--secondary))] mb-4">No accounts yet</p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Account
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {kiroAccounts.map((account) => (
            <Card key={account.id}>
              <CardHeader>
                <CardTitle className="text-lg">{account.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[rgb(var(--secondary))]">{account.email}</p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="secondary">
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost">
                    Switch
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
