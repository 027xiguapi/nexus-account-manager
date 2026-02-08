import { useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'

export function ThemeManager() {
  const { theme } = useTheme()

  // 应用主题
  useEffect(() => {
    const applyTheme = (currentTheme: string) => {
      const root = document.documentElement
      const isDark = currentTheme === 'dark'

      // 设置 HTML 背景色
      root.style.backgroundColor = isDark ? '#000000' : '#ffffff'

      // 设置 dark class
      if (isDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleSystemChange = (e: MediaQueryListEvent | MediaQueryList) => {
        const systemTheme = e.matches ? 'dark' : 'light'
        applyTheme(systemTheme)
      }
      handleSystemChange(mediaQuery)
      mediaQuery.addEventListener('change', handleSystemChange)
      return () => mediaQuery.removeEventListener('change', handleSystemChange)
    } else {
      applyTheme(theme)
    }
  }, [theme])

  return null
}
