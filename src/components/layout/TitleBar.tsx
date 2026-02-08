import { X, Minus, Square } from 'lucide-react'
import { getCurrentWindow } from '@tauri-apps/api/window'

export function TitleBar() {
  const appWindow = getCurrentWindow()

  const handleMinimize = () => appWindow.minimize()
  const handleMaximize = () => appWindow.toggleMaximize()
  const handleClose = () => appWindow.close()

  return (
    <div
      className="h-8 bg-background flex items-center justify-end px-3 select-none border-b border-border/50"
      data-tauri-drag-region
    >
      {/* Window Controls (Windows Style but minimal) */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleMinimize}
          className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
          type="button"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleMaximize}
          className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
          type="button"
        >
          <Square className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleClose}
          className="p-1.5 hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors text-muted-foreground"
          type="button"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
