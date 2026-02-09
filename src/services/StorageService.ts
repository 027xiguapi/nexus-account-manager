import { invoke } from '@tauri-apps/api/core'

/**
 * 存储服务
 * 统一管理数据持久化路径和操作
 */
export class StorageService {
  private static instance: StorageService
  private currentPath: string | null = null

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService()
    }
    return StorageService.instance
  }

  /**
   * 获取当前存储路径
   */
  async getCurrentPath(): Promise<string> {
    if (!this.currentPath) {
      this.currentPath = await invoke<string>('get_current_storage_path')
    }
    return this.currentPath
  }

  /**
   * 设置存储路径
   */
  async setStoragePath(path: string): Promise<void> {
    await invoke('set_storage_path', { path })
    this.currentPath = path
  }

  /**
   * 选择存储目录
   */
  async selectDirectory(): Promise<string | null> {
    const selected = await invoke<string | null>('select_storage_directory')
    if (selected) {
      this.currentPath = selected
    }
    return selected
  }

  /**
   * 重置为默认路径
   */
  async resetToDefault(): Promise<void> {
    await invoke('set_storage_path', { path: '' })
    this.currentPath = null
  }
}
