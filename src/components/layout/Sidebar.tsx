import { NavLink } from 'react-router-dom'
import { Home, Users, Settings, Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Accounts', href: '/accounts', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-[rgb(var(--card))] border-r border-[rgb(var(--border))]">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-[rgb(var(--border))]">
        <h1 className="text-xl font-bold">Nexus</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
                'transition-colors duration-200',
                isActive
                  ? 'bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]'
                  : 'text-[rgb(var(--foreground))] hover:bg-[rgb(var(--background))]'
              )
            }
          >
            <>
              <item.icon className="h-5 w-5" />
              {item.name}
            </>
          </NavLink>
        ))}
      </nav>

      {/* Theme Toggle */}
      <div className="border-t border-[rgb(var(--border))] p-4">
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-[rgb(var(--background))] transition-colors"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </div>
  )
}
