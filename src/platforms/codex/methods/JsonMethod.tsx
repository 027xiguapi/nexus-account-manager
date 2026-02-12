/**
 * Codex 平台 - JSON 导入方式
 * 
 * 支持从 Provider 预设或 JSON 格式导入 OpenAI Codex API 配置
 */

import { logError } from '@/lib/logger'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { codexProviderPresets } from '../config/presets'
import { ProviderCarousel, ProviderInfo } from '@/components/common/ProviderCarousel'
import type { AddMethodProps } from '@/types/platform'
import type { CodexAccount } from '@/types/account'

type Status = 'idle' | 'processing' | 'success' | 'error'

interface CodexConfig {
  env: {
    OPENAI_API_KEY?: string
    OPENAI_BASE_URL?: string
    OPENAI_MODEL?: string
    OPENAI_ORGANIZATION?: string
    OPENAI_REASONING_EFFORT?: string
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
  const [reasoningEffort, setReasoningEffort] = useState('')

  // 初始化编辑模式数据
  useEffect(() => {
    if (initialData && isEdit) {
      try {
        const data = JSON.parse(initialData)
        if (data.config?.env) {
          setBaseUrl(data.config.env.OPENAI_BASE_URL || '')
          setApiKey(data.config.env.OPENAI_API_KEY || '')
          setModel(data.config.env.OPENAI_MODEL || '')
          setReasoningEffort(data.config.env.OPENAI_REASONING_EFFORT || '')
        }
      } catch (e) {
        logError('Failed to parse initial data:', e)
      }
    }
  }, [initialData, isEdit])

  // 当选择预设时，自动填充配置
  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId)
    const preset = codexProviderPresets.find((p) => p.id === presetId)
    if (preset) {
      setBaseUrl(preset.config.env.OPENAI_BASE_URL || '')
      // 自动填充预设的模型配置
      setModel(preset.config.env.OPENAI_MODEL || '')
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
      const selectedPreset = codexProviderPresets.find((p) => p.id === selectedPresetId)
      
      // 构建配置对象
      const config: CodexConfig = {
        env: {
          ...(selectedPreset?.config.env || {}),
          OPENAI_BASE_URL: baseUrl.trim() || undefined,
          OPENAI_API_KEY: apiKey.trim(),
          // 添加模型配置（如果用户填写了）
          OPENAI_MODEL: model.trim() || undefined,
          OPENAI_REASONING_EFFORT: reasoningEffort.trim() || undefined,
        },
      }

      // 移除空值
      Object.keys(config.env).forEach(key => {
        if (!config.env[key]) {
          delete config.env[key]
        }
      })

      // 创建账号对象
      const account: CodexAccount = {
        id: crypto.randomUUID(),
        platform: 'codex',
        email: extractEmailFromUrl(baseUrl) || selectedPreset?.name || 'codex@openai',
        name: selectedPreset?.name || extractNameFromUrl(baseUrl) || 'OpenAI Codex',
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

  const selectedPreset = codexProviderPresets.find((p) => p.id === selectedPresetId)

  return (
    <div className="space-y-6">
      {/* Provider 预设选择 - 统一轮播 */}
      <div className="space-y-3">
        <Label>
          {isEn ? 'Select Provider' : '选择供应商'} <span className="text-red-500">*</span>
        </Label>
        
        <ProviderCarousel
          providers={codexProviderPresets}
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
                placeholder="https://api.openai.com/v1"
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
                    ? 'Optional: Specify default model and reasoning effort. Leave empty to use system defaults.'
                    : '可选：指定默认模型和推理强度，留空则使用系统默认。'
                  }
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Model */}
                  <div className="space-y-2">
                    <Label htmlFor="model">
                      {isEn ? 'Model' : '模型'}
                    </Label>
                    <Input
                      id="model"
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="gpt-5.2"
                      disabled={status === 'processing'}
                    />
                  </div>

                  {/* Reasoning Effort */}
                  <div className="space-y-2">
                    <Label htmlFor="reasoning-effort">
                      {isEn ? 'Reasoning Effort' : '推理强度'}
                    </Label>
                    <Input
                      id="reasoning-effort"
                      type="text"
                      value={reasoningEffort}
                      onChange={(e) => setReasoningEffort(e.target.value)}
                      placeholder="medium"
                      disabled={status === 'processing'}
                    />
                    <p className="text-xs text-muted-foreground">
                      {isEn ? 'Options: low, medium, high' : '选项：low, medium, high'}
                    </p>
                  </div>
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
