import { LucideIcon } from 'lucide-react'

// 基础账号模型
export interface BaseAccount {
  id: string
  platform: string
  name: string
  email?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  tags?: string[]
  group?: string
  platformData: Record<string, any>
}

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
