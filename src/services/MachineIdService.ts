/**
 * 机器码服务（单例）
 * 系统级别的机器码管理，所有平台共享
 */
export class MachineIdService {
  private static instance: MachineIdService
  private machineIdMap: Map<string, string> = new Map() // accountId -> machineId

  private constructor() {}

  static getInstance(): MachineIdService {
    if (!MachineIdService.instance) {
      MachineIdService.instance = new MachineIdService()
    }
    return MachineIdService.instance
  }

  /**
   * 生成随机机器码
   */
  async generateMachineId(): Promise<string> {
    return crypto.randomUUID()
  }

  /**
   * 获取当前系统机器码
   */
  async getMachineId(): Promise<string> {
    const { invoke } = await import('@tauri-apps/api/core')
    return invoke<string>('get_machine_id')
  }

  /**
   * 设置系统机器码
   */
  async setMachineId(machineId: string): Promise<void> {
    const { invoke } = await import('@tauri-apps/api/core')
    await invoke('set_machine_id', { machineId })
  }

  /**
   * 绑定账号到机器码
   */
  async bindMachineId(accountId: string, machineId: string): Promise<void> {
    this.machineIdMap.set(accountId, machineId)
    const { invoke } = await import('@tauri-apps/api/core')
    await invoke('bind_machine_id', { accountId, machineId })
  }

  /**
   * 解绑账号的机器码
   */
  async unbindMachineId(accountId: string): Promise<void> {
    this.machineIdMap.delete(accountId)
    const { invoke } = await import('@tauri-apps/api/core')
    await invoke('unbind_machine_id', { accountId })
  }

  /**
   * 获取账号绑定的机器码
   */
  async getMachineIdForAccount(accountId: string): Promise<string | null> {
    // 先从内存缓存获取
    const cached = this.machineIdMap.get(accountId)
    if (cached) return cached

    // 从后端获取
    const { invoke } = await import('@tauri-apps/api/core')
    const machineId = await invoke<string | null>('get_machine_id_for_account', { accountId })

    if (machineId) {
      this.machineIdMap.set(accountId, machineId)
    }

    return machineId
  }

  /**
   * 获取所有账号的机器码绑定
   */
  async getAllBindings(): Promise<Map<string, string>> {
    const { invoke } = await import('@tauri-apps/api/core')
    const bindings = await invoke<Record<string, string>>('get_all_machine_id_bindings')
    
    this.machineIdMap.clear()
    Object.entries(bindings).forEach(([accountId, machineId]) => {
      this.machineIdMap.set(accountId, machineId)
    })

    return this.machineIdMap
  }
}
