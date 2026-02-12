import { invoke } from '@tauri-apps/api/core'
import { CodexProviderPreset } from '@/types/provider'
import { CodexEnvConfig } from '@/types/account'

export class CodexProviderService {
  async getCurrentConfig(): Promise<CodexEnvConfig> {
    return await invoke<CodexEnvConfig>('get_codex_provider_config')
  }

  async applyProvider(preset: CodexProviderPreset, apiKey: string): Promise<void> {
    const config: CodexEnvConfig = {
      env: {
        ...preset.config.env,
        OPENAI_API_KEY: apiKey,
      },
    }
    
    await invoke('apply_codex_provider', { config })
  }

  async applyConfig(config: CodexEnvConfig): Promise<void> {
    await invoke('apply_codex_provider', { config })
  }
}

export const codexProviderService = new CodexProviderService()
