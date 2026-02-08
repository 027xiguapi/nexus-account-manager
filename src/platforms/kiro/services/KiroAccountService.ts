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
    const sessionToken = legacyAccount.platformData.sessionToken as string
    if (!sessionToken) {
      throw new Error('No session token available')
    }

    // TODO: 调用 Kiro API 刷新 session
    // const response = await fetch('https://api.kiro.dev/refresh', {
    //   method: 'POST',
    //   body: JSON.stringify({ session_token: sessionToken }),
    // })

    // 模拟刷新
    return {
      ...account,
      // @ts-ignore
      platformData: {
        ...legacyAccount.platformData,
        sessionToken: 'new_session_token',
        tokenExpiry: new Date(Date.now() + 7200000).toISOString(),
      },
      // @ts-ignore
      updatedAt: new Date().toISOString(),
    } as unknown as BaseAccount // Force cast to match return type
  }

  /**
   * 获取配额
   * Kiro 特定的配额查询
   */
  async getQuota(account: BaseAccount): Promise<{ used: number; total: number }> {
    console.log(`[Kiro] Getting quota for ${account.name}`)

    // TODO: 调用 Kiro API 获取用量
    // const response = await fetch('https://api.kiro.dev/usage', {
    //   headers: { 'X-Session-Token': account.platformData.sessionToken },
    // })

    // 模拟配额数据
    return {
      used: Math.floor(Math.random() * 1000),
      total: 1000,
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
