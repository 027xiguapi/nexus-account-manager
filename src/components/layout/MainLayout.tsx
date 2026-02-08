import { Outlet } from 'react-router-dom'
import { TitleBar } from './TitleBar'
import { TopNav } from './TopNav'

export function MainLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[rgb(var(--background))]">
      <TitleBar />
      <TopNav />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
