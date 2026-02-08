import { Outlet } from 'react-router-dom'
import { TitleBar } from './TitleBar'
import { TopNav } from './TopNav'

export function MainLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background font-sans anti-aliased selection:bg-primary/20 selection:text-primary">
      <TitleBar />
      <div className="flex-1 relative overflow-hidden">
        {/* Header Overlay - absolute on top */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <TopNav />
        </div>

        {/* Main Content Area - scrolls under header */}
        <main className="absolute inset-0 overflow-y-auto scroll-smooth" style={{ paddingTop: '5rem' }}>
          {/* Add top padding to prevent content being hidden under header initially - using inline style as fallback */}
          <div className="pb-8 px-8 container mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
