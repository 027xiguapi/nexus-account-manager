import { BaseAccountService } from '@/services/base/BaseAccountService'
import { BaseAccount } from '@/types/platform'
import { MachineIdService } from '@/services/MachineIdService'

/**
 * Kiro 账号服务
 * 实现 Kiro IDE 特定的账号管理逻辑
 */
export class KiroAccountService extends BaseAccountService {
  constructor() {
    super('kiro')
  }

  /**
   * 验证账号
   * Kiro 特定的验证逻辑
   */
  async validateAccount(account: Partial<BaseAccount>): Promise<boolean> {
    // 检查必填字段
    if (!account.name) {
      return false
    }

    const legacyAccount = account as any
    // Kiro 可能需要 session token
    if (!legacyAccount.platformData?.sessionToken) {
      return false
    }

    return true
  }

  /**
   * 刷新 Token
   * Kiro 特定的刷新逻辑
   */
  async refreshToken(account: BaseAccount): Promise<BaseAccount> {
    console.log(`[Kiro] Refreshing token for ${account.name}`)

    const legacyAccount = account as any
    const platformData = legacyAccount.platformData || {}
    const { refreshToken, clientId, clientSecret } = platformData

    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const { invoke } = await import('@tauri-apps/api/core')

    // 调用后端刷新
    // Result<KiroTokenData, String>
    const tokenData = await invoke<any>('kiro_refresh_token', {
      refreshToken,
      clientId: clientId || '',
      clientSecret: clientSecret || ''
    })

    return {
      ...account,
      // @ts-ignore
      platformData: {
        ...platformData,
        accessToken: tokenData.accessToken,
        // 如果后端返还新的 refresh token 则更新，否则保持旧的
        refreshToken: tokenData.refreshToken || refreshToken,
        expiresIn: tokenData.expiresIn,
        tokenExpiry: new Date(Date.now() + (tokenData.expiresIn * 1000)).toISOString(),
      },
      // @ts-ignore
      updatedAt: new Date().toISOString(),
    } as unknown as BaseAccount
  }

  /**
   * 获取配额
   * Kiro 特定的配额查询
   */
  async getQuota(account: BaseAccount): Promise<{ used: number; total: number }> {
    console.log(`[Kiro] Getting quota for ${account.name}`)

    const legacyAccount = account as any
    const accessToken = legacyAccount.platformData?.accessToken || legacyAccount.platformData?.sessionToken

    if (!accessToken) {
      console.warn('[Kiro] No access token for quota check')
      return { used: 0, total: 0 }
    }

    const { invoke } = await import('@tauri-apps/api/core')
    // Result<KiroQuotaData, String>
    // KiroQuotaData { total_limit, current_usage ... } camelCase -> totalLimit, currentUsage
    const quota = await invoke<any>('kiro_check_quota', { accessToken })

    return {
      used: quota.currentUsage || 0,
      total: quota.totalLimit || 0,
    }
  }

  /**
   * 切换账号
   * Kiro 特定的切换逻辑（包括机器码切换）
   */
  async switchAccount(account: BaseAccount): Promise<void> {
    console.log(`[Kiro] Switching to account: ${account.name}`)

    // 1. 切换机器码（如果绑定了）- 使用全局单例
    const machineIdService = MachineIdService.getInstance()
    const machineId = await machineIdService.getMachineIdForAccount(account.id)
    const legacyAccount = account as any

    if (machineId) {
      console.log(`[Kiro] Switching machine ID to: ${machineId}`)
      await machineIdService.setMachineId(machineId)
    }

    // 2. 更新 Kiro IDE 配置
    const { invoke } = await import('@tauri-apps/api/core')
    await invoke('switch_kiro_account', {
      accountId: account.id,
      sessionToken: legacyAccount.platformData?.sessionToken,
      machineId,
    })
  }
}
