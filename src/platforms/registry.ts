import { PlatformConfig, PlatformRegistry } from '@/types/platform'
import { antigravityConfig } from './antigravity'
import { kiroConfig } from './kiro'
import { claudeConfig } from './claude'
import { codexConfig } from './codex'
import { geminiConfig } from './gemini'

// 所有平台配置
export const platforms: PlatformConfig[] = [
  antigravityConfig,
  kiroConfig,
  claudeConfig,
  codexConfig,
  geminiConfig,
]

// 平台注册表
export const platformRegistry: PlatformRegistry = new Map(
  platforms.map((platform) => [platform.id, platform])
)

// 获取平台配置
export function getPlatform(id: string): PlatformConfig | undefined {
  return platformRegistry.get(id)
}

// 获取所有平台
export function getAllPlatforms(): PlatformConfig[] {
  return platforms
}
