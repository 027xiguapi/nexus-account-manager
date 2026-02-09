/**
 * Gemini 平台 - JSON 导入方式
 * 
 * 支持从 JSON 格式导入 Google Gemini API 配置
 * 格式: {"env": {"GEMINI_API_KEY": "...", "GEMINI_PROJECT_ID": "...", "GEMINI_BASE_URL": "..."}}
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, CheckCircle2, AlertCircle, Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { AddMethodProps } from '@/types/platform'

type Status = 'idle' | 'processing' | 'success' | 'error'

interface GeminiEnvConfig {
  env: {
    GEMINI_API_KEY?: string
    GOOGLE_API_KEY?: string
    GEMINI_PROJECT_ID?: string
    GEMINI_BASE_URL?: string
  }
}

export function JsonMethod({ onSuccess, onError, onClose }: AddMethodProps) {
  const { i18n } = useTranslation()
  const isEn = i18n.language === 'en'

  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [jsonInput, setJsonInput] = useState('')

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setJsonInput(content)
    }
    reader.readAsText(file)
  }

  const handleSubmit = async () => {
    const trimmed = jsonInput.trim()
    if (!trimmed) {
      setStatus('error')
      setMessage(isEn ? 'Please enter JSON configuration' : '请输入 JSON 配置')
      return
    }

    setStatus('processing')
    setMessage(isEn ? 'Processing...' : '正在处理...')

    try {
      // 解析 JSON
      const config: GeminiEnvConfig = JSON.parse(trimmed)
      
      if (!config.env) {
        throw new Error(isEn ? 'Missing "env" field' : '缺少 "env" 字段')
      }

      const { GEMINI_API_KEY, GOOGLE_API_KEY, GEMINI_PROJECT_ID, GEMINI_BASE_URL } = config.env

      // 支持 GEMINI_API_KEY 或 GOOGLE_API_KEY
      const apiKey = GEMINI_API_KEY || GOOGLE_API_KEY

      if (!apiKey) {
        throw new Error(isEn 
          ? 'Missing GEMINI_API_KEY or GOOGLE_API_KEY' 
          : '缺少 GEMINI_API_KEY 或 GOOGLE_API_KEY')
      }

      // 创建账号对象
      const account: any = {
        id: crypto.randomUUID(),
        platform: 'gemini',
        email: extractEmailFromUrl(GEMINI_BASE_URL) || 'gemini@google',
        name: extractNameFromUrl(GEMINI_BASE_URL) || 'Google Gemini',
        isActive: false,
        lastUsedAt: Date.now(),
        createdAt: Date.now(),
        apiKey: apiKey,
        projectId: GEMINI_PROJECT_ID,
        baseUrl: GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1',
      }

      onSuccess(account)
      setStatus('success')
      setMessage(isEn ? 'Account added successfully!' : '账号添加成功！')
      setTimeout(onClose, 1500)

    } catch (e: any) {
      setStatus('error')
      setMessage(e.message || (isEn ? 'Invalid JSON format' : 'JSON 格式错误'))
      onError(e.message)
    }
  }

  const extractEmailFromUrl = (url?: string): string | null => {
    if (!url) return null
    try {
      const hostname = new URL(url).hostname
      return `api@${hostname}`
    } catch {
      return null
    }
  }

  const extractNameFromUrl = (url?: string): string | null => {
    if (!url) return null
    try {
      const hostname = new URL(url).hostname
      const parts = hostname.split('.')
      return parts[0] || hostname
    } catch {
      return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>
          {isEn ? 'JSON Configuration' : 'JSON 配置'}
        </Label>
        <textarea
          className="w-full h-48 rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          placeholder={`{
  "env": {
    "GEMINI_API_KEY": "AIza...",
    "GEMINI_PROJECT_ID": "my-project",
    "GEMINI_BASE_URL": "https://generativelanguage.googleapis.com/v1"
  }
}`}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          disabled={status === 'processing'}
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => document.getElementById('gemini-json-file-input')?.click()}
          disabled={status === 'processing'}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isEn ? 'Upload File' : '上传文件'}
        </Button>
        <input
          id="gemini-json-file-input"
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileUpload}
        />
        
        <Button
          className="flex-1"
          onClick={handleSubmit}
          disabled={status === 'processing' || !jsonInput.trim()}
        >
          {status === 'processing' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEn ? 'Import' : '导入'}
        </Button>
      </div>

      {/* Status Message */}
      {message && (
        <div className={cn(
          "flex items-center gap-2 p-3 rounded-lg text-sm",
          status === 'success' && "bg-green-500/10 text-green-600",
          status === 'error' && "bg-red-500/10 text-red-600",
          status === 'processing' && "bg-blue-500/10 text-blue-600"
        )}>
          {status === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0" />}
          {status === 'error' && <AlertCircle className="h-4 w-4 shrink-0" />}
          {status === 'processing' && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
          <span>{message}</span>
        </div>
      )}

      {/* Format Hint */}
      <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/30 rounded-lg">
        <p className="font-semibold">{isEn ? 'Supported fields:' : '支持的字段：'}</p>
        <ul className="list-disc list-inside space-y-0.5 ml-2">
          <li>GEMINI_API_KEY / GOOGLE_API_KEY {isEn ? '(required)' : '（必需）'}</li>
          <li>GEMINI_PROJECT_ID {isEn ? '(optional)' : '（可选）'}</li>
          <li>GEMINI_BASE_URL {isEn ? '(optional)' : '（可选）'}</li>
        </ul>
      </div>
    </div>
  )
}
