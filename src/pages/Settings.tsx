import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import {
  FolderOpen,
  Save,
  Database,
  Download,
  Upload,
  Palette,
  Moon,
  Sun,
  Laptop,
  Info,
  CheckCircle2
} from 'lucide-react'

export function Settings() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()
  const [storagePath, setStoragePath] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadStoragePath()
  }, [])

  const loadStoragePath = async () => {
    try {
      const path = await invoke<string>('get_current_storage_path')
      setStoragePath(path)
    } catch (error) {
      console.error('Failed to load storage path:', error)
    }
  }

  const handleUpdatePath = async () => {
    if (!storagePath) return
    setLoading(true)
    try {
      await invoke('set_storage_path', { path: storagePath })
      // Reload to confirm
      await loadStoragePath()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to set storage path:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          {t('settings.title')}
        </h1>
        <p className="text-muted-foreground mt-2 text-lg font-light">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* Storage Section */}
      <Card className="border-white/5 bg-card/40 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Database className="h-5 w-5" />
            </div>
            <CardTitle>{t('settings.storage')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
              {t('settings.dataLocation')}
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1 group">
                <FolderOpen className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={storagePath}
                  onChange={(e) => setStoragePath(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-10 py-2 text-sm shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="/path/to/accounts.json"
                />
              </div>
              <Button
                onClick={handleUpdatePath}
                disabled={loading}
                className={cn(
                  "min-w-[100px] transition-all",
                  success ? "bg-green-600 hover:bg-green-700" : ""
                )}
              >
                {loading ? (
                  t('common.loading')
                ) : success ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {t('common.save')}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t('common.save')}
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground pl-1">
              {t('settings.currentPath', { path: storagePath })}
            </p>
          </div>

          <div className="pt-6 border-t border-white/5">
            <h4 className="text-sm font-medium mb-4 flex items-center gap-2 text-muted-foreground">
              <Database className="h-4 w-4" />
              {t('settings.dataManagement')}
            </h4>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="bg-background/50 hover:bg-background/80">
                <Upload className="mr-2 h-4 w-4" />
                {t('settings.importLegacy')}
              </Button>
              <Button variant="outline" size="sm" className="bg-background/50 hover:bg-background/80">
                <Download className="mr-2 h-4 w-4" />
                {t('settings.exportData')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card className="border-white/5 bg-card/40 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <Palette className="h-5 w-5" />
            </div>
            <CardTitle>{t('settings.appearance')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-3">
            <label className="text-sm font-medium leading-none mb-3 block">{t('settings.theme')}</label>
            <div className="grid grid-cols-3 gap-4 max-w-md">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                className={cn("h-20 flex flex-col gap-2", theme !== 'light' && "bg-background/50 border-input")}
                onClick={() => setTheme('light')}
              >
                <Sun className="h-6 w-6" />
                {t('settings.light')}
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                className={cn("h-20 flex flex-col gap-2", theme !== 'dark' && "bg-background/50 border-input")}
                onClick={() => setTheme('dark')}
              >
                <Moon className="h-6 w-6" />
                {t('settings.dark')}
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                className={cn("h-20 flex flex-col gap-2", theme !== 'system' && "bg-background/50 border-input")}
                onClick={() => setTheme('system')}
              >
                <Laptop className="h-6 w-6" />
                {t('settings.system')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card className="border-white/5 bg-card/40 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
              <Info className="h-5 w-5" />
            </div>
            <CardTitle>{t('settings.about')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-lg bg-background/50 border border-white/5">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{t('settings.version')}</span>
              <p className="text-lg font-mono font-medium mt-1">1.0.0</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50 border border-white/5">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{t('settings.author')}</span>
              <p className="text-lg font-medium mt-1">Adnaan</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50 border border-white/5">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{t('settings.license')}</span>
              <p className="text-lg font-medium mt-1">MIT</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
