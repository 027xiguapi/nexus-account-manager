import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useTheme } from '@/hooks/useTheme'
import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'

export function Settings() {
  const { theme, setTheme } = useTheme()
  const [storagePath, setStoragePath] = useState('')
  const [loading, setLoading] = useState(false)

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
      // Reload to confirm (and ideally trigger a reload of data)
      await loadStoragePath()
      alert('Storage path updated. Please restart the app to load data from the new location.')
    } catch (error) {
      console.error('Failed to set storage path:', error)
      alert('Failed to set path')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your application preferences
        </p>
      </div>

      {/* Storage */}
      <Card>
        <CardHeader>
          <CardTitle>Storage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Data Location</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={storagePath}
                onChange={(e) => setStoragePath(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                placeholder="/path/to/accounts.json"
              />
              <Button
                size="sm"
                onClick={handleUpdatePath}
                disabled={loading}
              >
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Current path: {storagePath}
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-medium mb-2">Data Management</h4>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Import Legacy Data
              </Button>
              <Button variant="outline" size="sm">
                Export Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Theme</label>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTheme('light')}
              >
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTheme('dark')}
              >
                Dark
              </Button>
              <Button
                variant={theme === 'system' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTheme('system')}
              >
                System
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Version</span>
            <span className="text-sm font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Author</span>
            <span className="text-sm font-medium">adnaan</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">License</span>
            <span className="text-sm font-medium">MIT</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
