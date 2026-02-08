import { usePlatformStore } from '@/stores/usePlatformStore'
import { getAllPlatforms } from '@/platforms/registry'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { StatCard } from '@/components/dashboard/StatCard'
import { QuotaCard } from '@/components/dashboard/QuotaCard'
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard'
import { Users, Activity, Layers, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AntigravityAccount, KiroAccount } from '@/types/account'

export function Dashboard() {
  const accounts = usePlatformStore((state) => state.accounts)
  const navigate = useNavigate()
  const platforms = getAllPlatforms()
  const { t } = useTranslation()

  const activeAccounts = accounts.filter((a) => a.isActive).length
  const antigravityAccounts = accounts.filter((a): a is AntigravityAccount => a.platform === 'antigravity')
  const kiroAccounts = accounts.filter((a): a is KiroAccount => a.platform === 'kiro')

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your AI accounts and licenses.
          </p>
        </div>
        <Button onClick={() => navigate('/accounts')}>
          Manage Accounts
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('dashboard.totalAccounts')}
          value={accounts.length}
          icon={Users}
          description="Total managed accounts"
        />
        <StatCard
          title={t('dashboard.activeAccount')}
          value={activeAccounts}
          icon={Activity}
          description="Currently active"
          trend={{ value: 12, label: 'vs last month', positive: true }} // Mock trend for premium feel
        />
        <StatCard
          title="Antigravity"
          value={antigravityAccounts.length}
          icon={Layers}
          description="AI Service Accounts"
        />
        <StatCard
          title="Kiro IDE"
          value={kiroAccounts.length}
          icon={Layers}
          description="IDE Licenses"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <h2 className="text-lg font-semibold mb-4">Quota Usage (Antigravity)</h2>
          <QuotaCard accounts={antigravityAccounts} />
        </div>
        <div className="col-span-3">
          <h2 className="text-lg font-semibold mb-4">License Types (Kiro)</h2>
          <SubscriptionCard accounts={kiroAccounts} />
        </div>
      </div>

      {/* Platform Quick Access */}
      <div>
        <h2 className="text-lg font-semibold mb-4">{t('dashboard.platformsTitle')}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {platforms.map((platform) => {
            const Icon = platform.icon
            const platformAccounts = accounts.filter((a) => a.platform === platform.id)

            return (
              <div
                key={platform.id}
                className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-lg cursor-pointer"
                onClick={() => navigate(`/accounts?platform=${platform.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="p-3 rounded-xl transition-colors group-hover:bg-primary/10"
                        style={{ backgroundColor: `${platform.color}15` }}
                      >
                        <Icon className="h-6 w-6" style={{ color: platform.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{t(`platforms.${platform.id}.name`)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {platformAccounts.length} {t('common.accounts')}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
