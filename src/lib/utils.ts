import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Subscription Tier 工具函数
 * 用于格式化和处理订阅层级显示
 */

/**
 * 获取订阅层级的显示名称
 * @param tier - 订阅层级 ID (如 "g1-pro-tier", "g1-ultra-tier")
 * @returns 格式化的显示名称 ("PRO", "ULTRA", "FREE")
 */
export function getSubscriptionDisplayName(tier?: string): string {
  if (!tier) return 'FREE'
  const t = tier.toLowerCase()
  if (t.includes('ultra')) return 'ULTRA'
  if (t.includes('pro')) return 'PRO'
  return 'FREE'
}

/**
 * 获取订阅层级的样式类名
 * @param tier - 订阅层级 ID
 * @returns Tailwind CSS 类名字符串
 */
export function getSubscriptionStyle(tier?: string): string {
  if (!tier) return 'bg-secondary text-secondary-foreground'
  const t = tier.toLowerCase()
  if (t.includes('ultra')) return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
  if (t.includes('pro')) return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
  return 'bg-secondary text-secondary-foreground'
}

/**
 * 检查是否为付费订阅
 * @param tier - 订阅层级 ID
 * @returns 是否为付费订阅
 */
export function isPaidSubscription(tier?: string): boolean {
  if (!tier) return false
  const t = tier.toLowerCase()
  return t.includes('pro') || t.includes('ultra')
}
