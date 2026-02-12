import { invoke } from '@tauri-apps/api/core'
import { GeminiProviderPreset } from '@/types/provider'
import { GeminiEnvConfig } from '@/types/account'

export class GeminiProviderService {
  async getCurrentConfig(): Promise<GeminiEnvConfig> {
    return await invoke<GeminiEnvConfig>('get_gemini_provider_config')
  }

  async applyProvider(preset: GeminiProviderPreset, apiKey: string): Promise<void> {
    const config: GeminiEnvConfig = {
      env: {
        ...preset.config.env,
        GEMINI_API_KEY: apiKey,
      },
    }
    
    await invoke('apply_gemini_provider', { config })
  }

  async applyConfig(config: GeminiEnvConfig): Promise<void> {
    await invoke('apply_gemini_provider', { config })
  }
}

export const geminiProviderService = new GeminiProviderService()
