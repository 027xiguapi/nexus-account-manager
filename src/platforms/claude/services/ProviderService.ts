import { invoke } from '@tauri-apps/api/core'
import { ClaudeProviderPreset } from '@/types/provider'
import { ClaudeEnvConfig } from '@/types/account'

export class ClaudeProviderService {
  async getCurrentConfig(): Promise<ClaudeEnvConfig> {
    return await invoke<ClaudeEnvConfig>('get_claude_provider_config')
  }

  async applyProvider(preset: ClaudeProviderPreset, apiKey: string): Promise<void> {
    const config: ClaudeEnvConfig = {
      env: {
        ...preset.config.env,
        ANTHROPIC_AUTH_TOKEN: apiKey,
      },
    }
    
    await invoke('apply_claude_provider', { config })
  }

  async applyConfig(config: ClaudeEnvConfig): Promise<void> {
    await invoke('apply_claude_provider', { config })
  }
}

export const claudeProviderService = new ClaudeProviderService()
