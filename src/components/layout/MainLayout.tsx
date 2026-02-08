import { Outlet } from 'react-router-dom'
import { TitleBar } from './TitleBar'
import { TopNav } from './TopNav'

export function MainLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-transparent">
      <TitleBar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopNav />
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="container mx-auto p-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
