//! Antigravity 平台命令
//! 
//! 处理 Google OAuth、Token 验证、配额刷新等

use serde::Serialize;
use tauri::command;
use std::path::PathBuf;
use rusqlite::Connection;

/// OAuth URL 响应
#[derive(Serialize)]
#[allow(dead_code)]
pub struct OAuthUrlResponse {
    pub url: String,
    pub state: String,
}

/// 账号数据（简化版，用于返回给前端）
#[derive(Serialize)]
pub struct AntigravityAccountData {
    pub id: String,
    pub email: String,
    pub name: Option<String>,
    pub refresh_token: String,
}

/// 扫描到的 Token
#[derive(Serialize)]
pub struct FoundToken {
    pub source: String,
    pub token: String,
}

use crate::core::oauth;
use crate::core::oauth_server;
use crate::core::quota;
use tauri::AppHandle; 

// ... keep existing structs ...

/// 准备 OAuth URL
#[command]
pub async fn antigravity_prepare_oauth_url(app: AppHandle) -> Result<String, String> {
    // 使用自动服务器，启动本地监听并在 localhost 接收回调
    oauth_server::ensure_oauth_flow_prepared(Some(app)).await
}

/// 完成 OAuth 登录
#[command]
pub async fn antigravity_complete_oauth(code: String) -> Result<AntigravityAccountData, String> {
    // 提交验证码到本地服务器
    oauth_server::submit_oauth_code(code).await?;
    
    // 完成 Token 交换
    let token_res = oauth_server::complete_oauth_flow(None).await?;
    
    // Get User Info
    let user_info = oauth::get_user_info(&token_res.access_token).await?;
    
    // Create Account Data
    Ok(AntigravityAccountData {
        id: uuid::Uuid::new_v4().to_string(), // In real app, maybe hash of email
        email: user_info.email.clone(),
        name: user_info.get_display_name(),
        refresh_token: token_res.refresh_token.unwrap_or_default(), // Handle missing refresh token
    })
}

/// 通过 Refresh Token 添加账号
#[command]
pub async fn antigravity_add_by_token(refresh_token: String) -> Result<AntigravityAccountData, String> {
    // 简单验证格式
    if !refresh_token.starts_with("1//") && !refresh_token.contains(".") {
         // rough check
    }

    // 尝试刷新 Token 以验证有效性
    let token_res = oauth::refresh_access_token(&refresh_token).await?;
    
    // 获取用户信息
    let user_info = oauth::get_user_info(&token_res.access_token).await?;
    let name = user_info.get_display_name();
    
    Ok(AntigravityAccountData {
        id: uuid::Uuid::new_v4().to_string(),
        email: user_info.email,
        name,
        refresh_token,
    })
}

/// 获取配额信息
#[command]
pub async fn antigravity_get_quota(access_token: String) -> Result<quota::QuotaData, String> {
    let (data, _err) = quota::fetch_quota(&access_token, None).await?;
    Ok(data)
}
/// 自动扫描数据库
#[command]
pub fn antigravity_scan_databases() -> Result<Vec<FoundToken>, String> {
    let mut tokens = Vec::new();
    
    // 获取用户数据目录
    let appdata = std::env::var("APPDATA").map_err(|_| "Cannot get APPDATA")?;
    
    // 扫描路径列表
    let scan_paths = vec![
        PathBuf::from(&appdata).join("Code/User/globalStorage/state.vscdb"),
        PathBuf::from(&appdata).join("Cursor/User/globalStorage/state.vscdb"),
        PathBuf::from(&appdata).join("VSCodium/User/globalStorage/state.vscdb"),
    ];
    
    for path in scan_paths {
        if path.exists() {
            if let Ok(found) = scan_single_db(&path) {
                tokens.extend(found);
            }
        }
    }
    
    Ok(tokens)
}

/// 扫描单个数据库
fn scan_single_db(path: &PathBuf) -> Result<Vec<FoundToken>, String> {
    let conn = Connection::open(path).map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "SELECT key, value FROM ItemTable WHERE key LIKE '%token%' OR key LIKE '%auth%' OR key LIKE '%refresh%'"
    ).map_err(|e| e.to_string())?;
    
    let source = path.file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("unknown")
        .to_string();
    
    let token_iter = stmt.query_map([], |row| {
        let key: String = row.get(0)?;
        let value: String = row.get(1)?;
        Ok((key, value))
    }).map_err(|e| e.to_string())?;
    
    let mut tokens = Vec::new();
    for result in token_iter {
        if let Ok((key, value)) = result {
            // 只接受以 1// 开头的 Google refresh token
            if value.starts_with("1//") && value.len() > 10 {
                tokens.push(FoundToken {
                    source: format!("{}: {}", source, key),
                    token: value,
                });
            }
        }
    }
    
    Ok(tokens)
}

/// 选择数据库文件
/// 
/// 注意：此功能需要 tauri-plugin-dialog，当前返回 None 让前端使用手动输入
/// 选择数据库文件
#[command]
pub async fn select_db_file(app: AppHandle) -> Result<Option<String>, String> {
    use tauri_plugin_dialog::DialogExt;
    
    let result = app.dialog().file()
        .add_filter("VSCDB", &["vscdb"])
        .add_filter("All Files", &["*"])
        .blocking_pick_file();
        
    Ok(result.map(|path| path.to_string()))
}
