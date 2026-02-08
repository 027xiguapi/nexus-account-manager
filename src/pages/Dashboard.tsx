import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { usePlatformStore } from '@/stores/usePlatformStore'
import { getAllPlatforms } from '@/platforms/registry'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function Dashboard() {
  const accounts = usePlatformStore((state) => state.accounts)
  const navigate = useNavigate()
  const platforms = getAllPlatforms()
  const { t } = useTranslation()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">{t('dashboard.title')}</h1>
        <p className="text-[rgb(var(--secondary))] mt-2">
          {t('dashboard.welcome')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t('dashboard.totalAccounts')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{accounts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t('dashboard.activeAccount')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {accounts.filter((a) => a.isActive).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t('dashboard.platforms')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{platforms.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Platforms */}
      <div>
        <h2 className="text-2xl font-bold mb-4">{t('dashboard.platformsTitle')}</h2>
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
                      <CardTitle>{t(`platforms.${platform.id}.name`)}</CardTitle>
                      <p className="text-sm text-[rgb(var(--secondary))] mt-1">
                        {t(`platforms.${platform.id}.description`)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <span className="font-medium">{platformAccounts.length}</span> {t('common.accounts')}
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
