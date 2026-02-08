import { BaseAccountService } from './base/BaseAccountService'
import { BaseOAuthService } from './base/BaseOAuthService'

/**
 * 服务工厂
 * 使用工厂模式创建和管理平台服务实例
 * 注意：机器码服务是全局单例，不在这里管理
 */
export class ServiceFactory {
  private static accountServices = new Map<string, BaseAccountService>()
  private static oauthServices = new Map<string, BaseOAuthService>()

  /**
   * 注册账号服务
   */
  static registerAccountService(platformId: string, service: BaseAccountService): void {
    this.accountServices.set(platformId, service)
  }

  /**
   * 获取账号服务
   */
  static getAccountService(platformId: string): BaseAccountService | undefined {
    return this.accountServices.get(platformId)
  }

  /**
   * 注册 OAuth 服务
   */
  static registerOAuthService(platformId: string, service: BaseOAuthService): void {
    this.oauthServices.set(platformId, service)
  }

  /**
   * 获取 OAuth 服务
   */
  static getOAuthService(platformId: string): BaseOAuthService | undefined {
    return this.oauthServices.get(platformId)
  }

  /**
   * 清除所有服务（用于测试）
   */
  static clear(): void {
    this.accountServices.clear()
    this.oauthServices.clear()
  }
}
