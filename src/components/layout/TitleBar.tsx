import { X, Minus, Square } from 'lucide-react'
import { getCurrentWindow } from '@tauri-apps/api/window'

export function TitleBar() {
  const appWindow = getCurrentWindow()

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation()
    appWindow.minimize()
  }

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation()
    appWindow.toggleMaximize()
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    appWindow.close()
  }

  return (
    <div
      className="h-9 bg-background flex items-center justify-between px-4 select-none border-b border-white/5"
      data-tauri-drag-region
    >
      <div className="text-xs font-medium text-muted-foreground flex-1" data-tauri-drag-region>
        Nexus Account Manager
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={handleMinimize}
          className="w-8 h-8 flex items-center justify-center hover:bg-secondary rounded transition-colors text-muted-foreground hover:text-foreground"
          type="button"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleMaximize}
          className="w-8 h-8 flex items-center justify-center hover:bg-secondary rounded transition-colors text-muted-foreground hover:text-foreground"
          type="button"
        >
          <Square className="w-3 h-3" />
        </button>
        <button
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center hover:bg-red-500 hover:text-white rounded transition-colors"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
