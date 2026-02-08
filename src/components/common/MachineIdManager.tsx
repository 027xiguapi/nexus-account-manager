import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MachineIdService } from '@/services/MachineIdService'
import { RefreshCw, Copy, Check } from 'lucide-react'

interface MachineIdManagerProps {
  accountId?: string
}

/**
 * 通用机器码管理组件
 * 系统级别，所有平台共享
 */
export function MachineIdManager({ accountId }: MachineIdManagerProps) {
  const [currentMachineId, setCurrentMachineId] = useState<string>('')
  const [boundMachineId, setBoundMachineId] = useState<string | null>(null)
  const [newMachineId, setNewMachineId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const machineIdService = MachineIdService.getInstance()

  useEffect(() => {
    loadMachineIds()
  }, [accountId])

  const loadMachineIds = async () => {
    try {
      const current = await machineIdService.getMachineId()
      setCurrentMachineId(current)

      if (accountId) {
        const bound = await machineIdService.getMachineIdForAccount(accountId)
        setBoundMachineId(bound)
      }
    } catch (error) {
      console.error('Failed to load machine IDs:', error)
    }
  }

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const machineId = await machineIdService.generateMachineId()
      setNewMachineId(machineId)
    } catch (error) {
      console.error('Failed to generate machine ID:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!newMachineId) return

    setLoading(true)
    try {
      await machineIdService.setMachineId(newMachineId)
      setCurrentMachineId(newMachineId)
      setNewMachineId('')
      alert('Machine ID updated successfully!')
    } catch (error) {
      console.error('Failed to apply machine ID:', error)
      alert('Failed to update machine ID')
    } finally {
      setLoading(false)
    }
  }

  const handleBind = async () => {
    if (!accountId || !currentMachineId) return

    setLoading(true)
    try {
      await machineIdService.bindMachineId(accountId, currentMachineId)
      setBoundMachineId(currentMachineId)
      alert('Machine ID bound to account successfully!')
    } catch (error) {
      console.error('Failed to bind machine ID:', error)
      alert('Failed to bind machine ID')
    } finally {
      setLoading(false)
    }
  }

  const handleUnbind = async () => {
    if (!accountId) return

    setLoading(true)
    try {
      await machineIdService.unbindMachineId(accountId)
      setBoundMachineId(null)
      alert('Machine ID unbound successfully!')
    } catch (error) {
      console.error('Failed to unbind machine ID:', error)
      alert('Failed to unbind machine ID')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="space-y-4">
      {/* Current Machine ID */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Machine ID</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input value={currentMachineId} readOnly className="font-mono text-sm" />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleCopy(currentMachineId)}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generate New Machine ID */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generate New Machine ID</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={newMachineId}
              onChange={(e) => setNewMachineId(e.target.value)}
              placeholder="Generated machine ID will appear here"
              className="font-mono text-sm"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGenerate}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <Button onClick={handleApply} disabled={!newMachineId || loading} className="w-full">
            Apply New Machine ID
          </Button>
        </CardContent>
      </Card>

      {/* Account Binding (if accountId provided) */}
      {accountId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Binding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {boundMachineId ? (
              <>
                <div className="text-sm text-[rgb(var(--secondary))]">
                  This account is bound to:
                </div>
                <div className="flex gap-2">
                  <Input value={boundMachineId} readOnly className="font-mono text-sm" />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleCopy(boundMachineId)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Button variant="destructive" onClick={handleUnbind} disabled={loading} className="w-full">
                  Unbind Machine ID
                </Button>
              </>
            ) : (
              <>
                <div className="text-sm text-[rgb(var(--secondary))]">
                  No machine ID bound to this account
                </div>
                <Button onClick={handleBind} disabled={loading} className="w-full">
                  Bind Current Machine ID
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
