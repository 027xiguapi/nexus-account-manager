use crate::core::kiro as core_kiro;
use tauri::{command, AppHandle, Manager};
use serde::Serialize;
use uuid::Uuid;
use tauri_plugin_opener::OpenerExt;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DeviceAuthResult {
    pub device_code: String,
    pub user_code: String,
    pub verification_uri: String,
    pub expires_in: i64,
    pub interval: i64,
    pub client_id: String,
    pub client_secret: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct KiroAccountData {
    pub completed: bool,
    pub account: Option<KiroAccount>,
    pub error: Option<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct KiroAccount {
    pub id: String,
    pub email: String,
    pub name: Option<String>,
    pub access_token: String,
    pub refresh_token: Option<String>,
    pub client_id: Option<String>,
    pub client_secret: Option<String>,
    pub expires_in: i64,
    pub quota: core_kiro::KiroQuotaData,
}

/// 启动设备授权流程
#[command]
pub async fn kiro_start_device_auth() -> Result<DeviceAuthResult, String> {
    // 1. 注册客户端
    let (client_id, client_secret) = core_kiro::register_client().await?;
    
    // 2. 启动设备授权
    let auth_res = core_kiro::start_device_authorization(&client_id, &client_secret).await?;
    
    Ok(DeviceAuthResult {
        device_code: auth_res.deviceCode,
        user_code: auth_res.userCode,
        verification_uri: auth_res.verificationUri,
        expires_in: auth_res.expiresIn,
        interval: auth_res.interval,
        client_id,
        client_secret,
    })
}

/// 轮询 Token 并获取完整账号信息
#[command]
pub async fn kiro_poll_token(
    device_code: String, 
    client_id: String, 
    client_secret: String
) -> Result<KiroAccountData, String> {
    // 进行一次检查
    // Poll Token
    let token_res = match core_kiro::poll_token(&client_id, &client_secret, &device_code, 5).await {
        Ok(t) => t,
        Err(e) => {
            if e == "pending" || e == "slow_down" {
                return Ok(KiroAccountData {
                    completed: false,
                    account: None,
                    error: None
                });
            }
            return Ok(KiroAccountData {
                completed: false,
                account: None,
                error: Some(e)
            });
        }
    };

    // 获取配额和用户信息
    let quota_res = core_kiro::get_usage_limits(&token_res.access_token).await
        .map_err(|e| format!("Failed to fetch user info: {}", e))?;

    let email = quota_res.email.clone().unwrap_or("unknown@example.com".to_string());
    let name = email.split('@').next().map(|s| s.to_string());

    Ok(KiroAccountData {
        completed: true,
        account: Some(KiroAccount {
            id: Uuid::new_v4().to_string(),
            email,
            name,
            access_token: token_res.access_token,
            refresh_token: token_res.refresh_token,
            client_id: token_res.client_id,
            client_secret: token_res.client_secret,
            expires_in: token_res.expires_in,
            quota: quota_res,
        }),
        error: None,
    })
}

/// 检查配额
#[command]
pub async fn kiro_check_quota(access_token: String) -> Result<core_kiro::KiroQuotaData, String> {
    core_kiro::get_usage_limits(&access_token).await
}

/// 刷新 Token
#[command]
pub async fn kiro_refresh_token(
    refresh_token: String, 
    client_id: String, 
    client_secret: String
) -> Result<core_kiro::KiroTokenData, String> {
    core_kiro::refresh_token(&refresh_token, &client_id, &client_secret).await
}

// 模拟取消 (实际逻辑由前端停止轮询)
#[command]
pub fn kiro_cancel_auth() -> Result<(), String> {
    Ok(())
}

/// 导入 SSO Token
#[command]
pub async fn kiro_import_sso_token(token: String) -> Result<KiroAccount, String> {
    // 验证 Token (通过获取配额)
    let quota_res = core_kiro::get_usage_limits(&token).await
        .map_err(|e| format!("Invalid SSO Token: {}", e))?;

    let email = quota_res.email.clone().unwrap_or("imported@example.com".to_string());
    let name = email.split('@').next().map(|s| s.to_string());

    Ok(KiroAccount {
        id: Uuid::new_v4().to_string(),
        email,
        name,
        access_token: token,
        refresh_token: None, // SSO Token 通常没有 Refresh Token 或者是在外部管理
        client_id: None,
        client_secret: None,
        expires_in: 0, // 未知过期时间
        quota: quota_res,
    })
}

/// 验证 OIDC 凭证并导入
#[command]
pub async fn kiro_verify_credentials(credentials: serde_json::Value) -> Result<KiroAccount, String> {
    let client_id = credentials.get("clientId").and_then(|v| v.as_str()).ok_or("Missing clientId")?;
    let client_secret = credentials.get("clientSecret").and_then(|v| v.as_str()).ok_or("Missing clientSecret")?;
    let refresh_token = credentials.get("refreshToken").and_then(|v| v.as_str()).ok_or("Missing refreshToken")?;

    // 尝试刷新以获取 Access Token
    let token_res = core_kiro::refresh_token(refresh_token, client_id, client_secret).await
        .map_err(|e| format!("Invalid Credentials: {}", e))?;

    // 获取配额和用户信息
    let quota_res = core_kiro::get_usage_limits(&token_res.access_token).await
        .map_err(|e| format!("Failed to fetch info: {}", e))?;

    let email = quota_res.email.clone().unwrap_or("unknown@example.com".to_string());
    let name = email.split('@').next().map(|s| s.to_string());

    Ok(KiroAccount {
        id: Uuid::new_v4().to_string(),
        email,
        name,
        access_token: token_res.access_token,
        refresh_token: Some(token_res.refresh_token.unwrap_or(refresh_token.to_string())),
        client_id: Some(client_id.to_string()),
        client_secret: Some(client_secret.to_string()),
        expires_in: token_res.expires_in,
        quota: quota_res,
    })
}

/// 社交登录
#[command]
pub async fn kiro_social_login(app: AppHandle, provider: String) -> Result<KiroAccount, String> {
    let (tx, mut rx) = tokio::sync::mpsc::channel::<String>(1);
    
    // 注册 Sender
    if let Some(state) = app.try_state::<core_kiro::DeepLinkState>() {
        // Explicitly annotate closure argument type to satisfy E0282
        let mut sender_guard = state.sender.lock().map_err(|e: std::sync::PoisonError<_>| e.to_string())?;
        *sender_guard = Some(tx);
    } else {
        return Err("DeepLinkState not initialized".to_string());
    }

    // 构建 URL
    // 注意：Callback URL 必须是 kiro://oauth/callback
    let callback_url = "kiro://oauth/callback";
    let url = format!(
        "https://app.kiro.dev/login?provider={}&callback={}&source=desktop",
        provider.to_lowercase(),
        urlencoding::encode(callback_url)
    );

    // 打开浏览器
    app.opener().open_url(&url, None::<&str>)
        .map_err(|e| format!("Failed to open browser: {}", e))?;

    // 等待回调
    // 设置超时 5 分钟
    let url = tokio::time::timeout(std::time::Duration::from_secs(300), rx.recv())
        .await
        .map_err(|_| "Login timed out".to_string())?
        .ok_or("Channel closed".to_string())?;

    // 解析 URL
    // kiro://oauth/callback?token=...
    let url_parsed = url::Url::parse(&url).map_err(|e| format!("Invalid callback URL: {}", e))?;
    let pairs = url_parsed.query_pairs();
    let token = pairs.into_iter().find(|(k, _)| k == "token")
        .map(|(_, v)| v.to_string())
        .ok_or("No token in callback")?;

    // 导入 Token
    kiro_import_sso_token(token).await
}

/// 切换 Kiro 账号 (存根)
#[command]
pub async fn switch_kiro_account(account_id: String, session_token: Option<String>, machine_id: Option<String>) -> Result<(), String> {
    println!("Switching Kiro account to {}, machine: {:?}", account_id, machine_id);
    // TODO: Implement actual IDE config switching
    Ok(())
}
