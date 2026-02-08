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
    <nav className="h-16 flex items-center justify-between px-6 z-40 sticky top-0 bg-background/50 backdrop-blur-xl border-b border-white/5 supports-[backdrop-filter]:bg-background/20">
      {/* Logo */}
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="font-bold text-white text-lg">N</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 tracking-tight">
            {t('app.name')}
          </h1>
        </div>

        {/* Navigation */}
        <div className="flex items-center p-1 bg-white/5 rounded-full border border-white/5 backdrop-blur-3xl">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
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
      <div className="flex items-center gap-3">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-muted-foreground hover:text-foreground"
        >
          <Globe className="h-3.5 w-3.5" />
          {i18n.language === 'zh' ? '中文' : 'EN'}
        </button>

        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-muted-foreground hover:text-foreground hover:shadow-lg hover:shadow-purple-500/10"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </nav>
  )
}
