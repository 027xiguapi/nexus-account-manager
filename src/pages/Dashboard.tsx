import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { usePlatformStore } from '@/stores/usePlatformStore'
import { getAllPlatforms } from '@/platforms/registry'
import { useNavigate } from 'react-router-dom'

export function Dashboard() {
  const accounts = usePlatformStore((state) => state.accounts)
  const navigate = useNavigate()
  const platforms = getAllPlatforms()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-[rgb(var(--secondary))] mt-2">
          Welcome to Nexus Account Manager
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{accounts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {accounts.filter((a) => a.isActive).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Platforms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{platforms.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Platforms */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Platforms</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {platforms.map((platform) => {
            const Icon = platform.icon
            const platformAccounts = accounts.filter((a) => a.platform === platform.id)

            return (
              <Card
                key={platform.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/accounts?platform=${platform.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${platform.color}20` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: platform.color }} />
                    </div>
                    <div>
                      <CardTitle>{platform.name}</CardTitle>
                      <p className="text-sm text-[rgb(var(--secondary))] mt-1">
                        {platform.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <span className="font-medium">{platformAccounts.length}</span> accounts
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
