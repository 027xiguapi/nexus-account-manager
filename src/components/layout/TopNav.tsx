import { NavLink } from 'react-router-dom'
import { Home, Users, Settings, Moon, Sun, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'
import { useTranslation } from 'react-i18next'

const navigation = [
  { name: 'nav.dashboard', href: '/', icon: Home },
  { name: 'nav.accounts', href: '/accounts', icon: Users },
  { name: 'nav.settings', href: '/settings', icon: Settings },
]

export function TopNav() {
  const { theme, setTheme } = useTheme()
  const { t, i18n } = useTranslation()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')
  }

  return (
    <nav className="h-14 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-bold">{t('app.name')}</h1>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-background'
                )
              }
            >
              <>
                <item.icon className="h-4 w-4" />
                {t(item.name)}
              </>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-background transition-colors"
        >
          <Globe className="h-4 w-4" />
          {i18n.language === 'zh' ? '中文' : 'EN'}
        </button>

        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-background transition-colors"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </nav>
  )
}
