import { NavLink } from 'react-router-dom'
import { Home, Users, Settings, Moon, Sun, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'
import { useTranslation } from 'react-i18next'

export function TopNav() {
  const { theme, setTheme } = useTheme()
  const { t, i18n } = useTranslation()

  const navigation = [
    { name: 'nav.dashboard', href: '/', icon: Home },
    { name: 'nav.accounts', href: '/accounts', icon: Users },
    { name: 'nav.settings', href: '/settings', icon: Settings },
  ]

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')
  }

  return (
    <nav className="h-16 flex items-center justify-between px-6 z-40 sticky top-0 bg-background/80 backdrop-blur-md border-b border-border shadow-sm transition-colors duration-300">
      {/* Logo */}
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-sm">
            <span className="font-bold text-white text-lg">N</span>
          </div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            {t('app.name')}
          </h1>
        </div>

        {/* Navigation */}
        <div className="flex items-center p-1 bg-muted/60 rounded-full border border-border/50">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {t(item.name)}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-muted/40 hover:bg-muted border border-transparent transition-all text-muted-foreground hover:text-foreground"
        >
          <Globe className="h-3.5 w-3.5" />
          {i18n.language === 'zh' ? '中文' : 'EN'}
        </button>

        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/40 hover:bg-muted border border-transparent transition-all text-muted-foreground hover:text-foreground"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </nav>
  )
}
