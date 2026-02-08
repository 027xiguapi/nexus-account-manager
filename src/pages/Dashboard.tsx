import { usePlatformStore } from '@/stores/usePlatformStore'
import { getAllPlatforms } from '@/platforms/registry'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { StatCard } from '@/components/dashboard/StatCard'
import { QuotaCard } from '@/components/dashboard/QuotaCard'
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard'
import { Users, Activity, Layers, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('dashboard.title')}
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <Button onClick={() => navigate('/accounts')} size="lg" className="shadow-sm">
          {t('dashboard.manageAccounts') || "Manage Accounts"}
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('dashboard.totalAccounts')}
          value={accounts.length}
          icon={Users}
          description="Total managed accounts"
          variant="blue"
          className="bg-card shadow-sm border-border/60"
        />
        <StatCard
          title={t('dashboard.activeAccount')}
          value={activeAccounts}
          icon={Activity}
          description="Currently active"
          trend={{ value: 12, label: 'vs last month', positive: true }}
          variant="green"
          className="bg-card shadow-sm border-border/60"
        />
        <StatCard
          title="Antigravity"
          value={antigravityAccounts.length}
          icon={Layers}
          description="AI Service Accounts"
          variant="purple"
          className="bg-card shadow-sm border-border/60"
        />
        <StatCard
          title="Kiro IDE"
          value={kiroAccounts.length}
          icon={Layers}
          description="IDE Licenses"
          variant="orange"
          className="bg-card shadow-sm border-border/60"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 bg-card rounded-xl p-6 shadow-sm border border-border/60 hover:shadow-md transition-all">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Quota Usage (Antigravity)</h2>
          <QuotaCard accounts={antigravityAccounts} />
        </div>
        <div className="col-span-3 bg-card rounded-xl p-6 shadow-sm border border-border/60 hover:shadow-md transition-all">
          <h2 className="text-lg font-semibold mb-4 text-foreground">License Types (Kiro)</h2>
          <SubscriptionCard accounts={kiroAccounts} />
        </div>
      </div>

      {/* Platform Quick Access */}
      <div>
        <h2 className="text-xl font-semibold mb-6 text-foreground">{t('dashboard.platformsTitle')}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {platforms.map((platform) => {
            const Icon = platform.icon
            const platformAccounts = accounts.filter((a) => a.platform === platform.id)

            return (
              <div
                key={platform.id}
                className="group relative overflow-hidden rounded-xl border border-border/60 bg-card text-card-foreground shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 cursor-pointer"
                onClick={() => navigate(`/accounts?platform=${platform.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="p-3.5 rounded-2xl transition-all group-hover:scale-110 duration-300 shadow-sm border border-transparent group-hover:border-current/20"
                        style={{ backgroundColor: `${platform.color}33`, color: platform.color }}
                      >
                        <Icon className="h-7 w-7 text-current" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl tracking-tight">{t(`platforms.${platform.id}.name`)}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {platformAccounts.length} {t('common.accounts')}
                        </p>
                      </div>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-primary/10">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
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
