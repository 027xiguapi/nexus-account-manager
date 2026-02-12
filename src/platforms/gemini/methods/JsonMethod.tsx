/**
 * Gemini 平台 - JSON 导入方式
 * 
 * 支持从 Provider 预设或 JSON 格式导入 Google Gemini API 配置
 */

import { logError } from '@/lib/logger'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { geminiProviderPresets } from '../config/presets'
import { ProviderCarousel, ProviderInfo } from '@/components/common/ProviderCarousel'
import type { AddMethodProps } from '@/types/platform'
import type { GeminiAccount } from '@/types/account'

type Status = 'idle' | 'processing' | 'success' | 'error'

interface GeminiConfig {
  env: {
    GEMINI_API_KEY?: string
    GOOGLE_API_KEY?: string
    GOOGLE_GEMINI_BASE_URL?: string
    GEMINI_MODEL?: string
    [key: string]: any
  }
  [key: string]: any
}

interface JsonMethodProps extends AddMethodProps {
  initialData?: string
  isEdit?: boolean
}

export function JsonMethod({ onSuccess, onError, onClose, initialData, isEdit = false }: JsonMethodProps) {
  const { i18n } = useTranslation()
  const isEn = i18n.language === 'en'

  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [selectedPresetId, setSelectedPresetId] = useState<string>('')
  const [baseUrl, setBaseUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // 模型配置
  const [model, setModel] = useState('')

  // 初始化编辑模式数据
  useEffect(() => {
    if (initialData && isEdit) {
      try {
        const data = JSON.parse(initialData)
        if (data.config?.env) {
          setBaseUrl(data.config.env.GOOGLE_GEMINI_BASE_URL || '')
          const key = data.config.env.GEMINI_API_KEY || data.config.env.GOOGLE_API_KEY
          setApiKey(key || '')
          setModel(data.config.env.GEMINI_MODEL || '')
        }
      } catch (e) {
        logError('Failed to parse initial data:', e)
      }
    }
  }, [initialData, isEdit])

  // 当选择预设时，自动填充配置
  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId)
    const preset = geminiProviderPresets.find((p) => p.id === presetId)
    if (preset) {
      setBaseUrl(preset.config.env.GOOGLE_GEMINI_BASE_URL || '')
      // 自动填充预设的模型配置
      setModel(preset.config.env.GEMINI_MODEL || '')
      // 不自动填充 API Key，让用户手动输入
    }
  }

  const handleSubmit = async () => {
    if (!apiKey.trim()) {
      setStatus('error')
      setMessage(isEn ? 'API Key is required' : 'API Key 是必需的')
      return
    }

    setStatus('processing')
    setMessage(isEn ? 'Processing...' : '正在处理...')

    try {
      const selectedPreset = geminiProviderPresets.find((p) => p.id === selectedPresetId)
      
      // 构建配置对象
      const config: GeminiConfig = {
        env: {
          ...(selectedPreset?.config.env || {}),
          GOOGLE_GEMINI_BASE_URL: baseUrl.trim() || undefined,
          GEMINI_API_KEY: apiKey.trim(),
          // 添加模型配置（如果用户填写了）
          GEMINI_MODEL: model.trim() || undefined,
        },
      }

      // 移除空值
      Object.keys(config.env).forEach(key => {
        if (!config.env[key]) {
          delete config.env[key]
        }
      })

      // 创建账号对象
      const account: GeminiAccount = {
        id: crypto.randomUUID(),
        platform: 'gemini',
        email: extractEmailFromUrl(baseUrl) || selectedPreset?.name || 'gemini@google',
        name: selectedPreset?.name || extractNameFromUrl(baseUrl) || 'Google Gemini',
        isActive: false,
        lastUsedAt: Date.now(),
        createdAt: Date.now(),
        providerId: selectedPresetId || undefined,
        config: config,
      }

      onSuccess(account)
      setStatus('success')
      setMessage(isEdit 
        ? (isEn ? 'Account updated successfully!' : '账号更新成功！')
        : (isEn ? 'Account added successfully!' : '账号添加成功！')
      )
      setTimeout(onClose, 1500)

    } catch (e: any) {
      setStatus('error')
      setMessage(e.message || (isEn ? 'Failed to add account' : '添加账号失败'))
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

  const selectedPreset = geminiProviderPresets.find((p) => p.id === selectedPresetId)

  return (
    <div className="space-y-6">
      {/* Provider 预设选择 - 统一轮播 */}
      <div className="space-y-3">
        <Label>
          {isEn ? 'Select Provider' : '选择供应商'} <span className="text-red-500">*</span>
        </Label>
        
        <ProviderCarousel
          providers={geminiProviderPresets}
          selectedId={selectedPresetId}
          onSelect={handlePresetChange}
          isEn={isEn}
        />
      </div>

      {/* 选中后显示详细信息和配置 */}
      {selectedPresetId && (
        <>
          {/* 供应商详细信息 */}
          {selectedPreset && (
            <ProviderInfo provider={selectedPreset} isEn={isEn} />
          )}

          {/* Base URL（自定义时可编辑） */}
          {selectedPresetId === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="base-url">
                Base URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="base-url"
                type="text"
                placeholder="https://generativelanguage.googleapis.com/v1"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                disabled={status === 'processing'}
              />
            </div>
          )}

          {/* API Key */}
          <div className="space-y-2">
            <Label htmlFor="api-key">
              API Key <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showPassword ? "text" : "password"}
                placeholder={isEn ? 'Enter your API key' : '输入你的 API Key'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={status === 'processing'}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={status === 'processing'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Advanced Settings - Model Configuration */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{isEn ? 'Advanced Settings' : '高级设置'}</span>
              <span className={cn("transition-transform", showAdvanced && "rotate-180")}>▼</span>
            </button>

            {showAdvanced && (
              <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
                <div className="text-xs text-muted-foreground">
                  {isEn 
                    ? 'Optional: Specify default Gemini model. Leave empty to use system defaults.'
                    : '可选：指定默认使用的 Gemini 模型，留空则使用系统默认。'
                  }
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">
                    {isEn ? 'Model' : '模型'}
                  </Label>
                  <Input
                    id="model"
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="gemini-3-pro"
                    disabled={status === 'processing'}
                  />
                </div>
              </div>
            )}
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={status === 'processing' || !apiKey.trim() || (selectedPresetId === 'custom' && !baseUrl.trim())}
          >
            {status === 'processing' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit 
              ? (isEn ? 'Update Account' : '更新账号')
              : (isEn ? 'Add Account' : '添加账号')
            }
          </Button>
        </>
      )}

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
    </div>
  )
}
