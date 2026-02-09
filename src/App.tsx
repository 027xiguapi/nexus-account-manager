import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { Dashboard } from './pages/Dashboard'
import { Accounts } from './pages/Accounts'
import { Settings } from './pages/Settings'
import { ThemeManager } from './components/common/ThemeManager'
import { useEffect } from 'react'
import { usePlatformStore } from './stores/usePlatformStore'

function App() {
  const loadAllAccounts = usePlatformStore((state) => state.loadAllAccounts)

  useEffect(() => {
    // 应用启动时加载所有账户
    loadAllAccounts().catch((error) => {
      console.error('Failed to load accounts on startup:', error)
    })
  }, [loadAllAccounts])

  return (
    <>
      <ThemeManager />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
