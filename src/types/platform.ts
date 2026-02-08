import { LucideIcon } from 'lucide-react'
import { Account } from './account'

export type { Account } from './account'
export type BaseAccount = Account


// 平台配额信息
export interface Quota {
  used: number
  total: number
  percentage: number
  resetAt?: string
}

// 平台特性标志
export interface PlatformFeatures {
  oauth?: boolean
  quota?: boolean
  proxy?: boolean
  machineId?: boolean
  autoRefresh?: boolean
}

// 平台配置接口
export interface PlatformConfig {
  id: string
  name: string
  icon: LucideIcon
  color: string
  description: string

  // 页面组件
  AccountList: React.ComponentType<any>
  AccountDetail?: React.ComponentType<any>
  Settings?: React.ComponentType<any>

  // 特性标志
  features: PlatformFeatures
}

// 平台注册表
export type PlatformRegistry = Map<string, PlatformConfig>
