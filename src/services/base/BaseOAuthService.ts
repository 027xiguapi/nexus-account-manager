/**
 * OAuth 配置接口
 */
export interface OAuthConfig {
  clientId: string
  clientSecret?: string
  authUrl: string
  tokenUrl: string
  redirectUri: string
  scopes: string[]
}

/**
 * OAuth 服务接口
 */
export interface IOAuthService {
  getAuthUrl(): string
  handleCallback(code: string): Promise<{ accessToken: string; refreshToken?: string }>
  refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken?: string }>
}

/**
 * OAuth 服务基类
 * 提供通用的 OAuth 2.0 流程实现
 */
export abstract class BaseOAuthService implements IOAuthService {
  protected config: OAuthConfig
  protected platformId: string

  constructor(platformId: string, config: OAuthConfig) {
    this.platformId = platformId
    this.config = config
  }

  /**
   * 生成授权 URL
   * 标准 OAuth 2.0 授权码流程
   */
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scopes.join(' '),
      state: this.generateState(),
    })

    return `${this.config.authUrl}?${params.toString()}`
  }

  /**
   * 处理授权回调
   * 用授权码换取访问令牌
   */
  async handleCallback(code: string): Promise<{ accessToken: string; refreshToken?: string }> {
    const response = await fetch(this.config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret || '',
        redirect_uri: this.config.redirectUri,
      }),
    })

    if (!response.ok) {
      throw new Error(`OAuth callback failed: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    }
  }

  /**
   * 刷新访问令牌
   */
  async refreshAccessToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken?: string }> {
    const response = await fetch(this.config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret || '',
      }),
    })

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || refreshToken,
    }
  }

  /**
   * 生成随机 state 参数（防 CSRF）
   */
  protected generateState(): string {
    return crypto.randomUUID()
  }
}
