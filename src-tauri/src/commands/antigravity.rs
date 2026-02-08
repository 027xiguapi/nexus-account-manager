//! Antigravity 平台命令
//! 
//! 处理 Google OAuth、Token 验证、配额刷新等

use serde::Serialize;
use tauri::command;
use std::path::PathBuf;
use rusqlite::Connection;

/// OAuth URL 响应
#[derive(Serialize)]
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

/// 准备 OAuth URL
#[command]
pub fn antigravity_prepare_oauth_url() -> Result<String, String> {
    // Google OAuth 配置
    let client_id = "YOUR_GOOGLE_CLIENT_ID"; // TODO: 从配置读取
    let redirect_uri = "urn:ietf:wg:oauth:2.0:oob";
    let scope = "email profile openid";
    
    let url = format!(
        "https://accounts.google.com/o/oauth2/v2/auth?client_id={}&redirect_uri={}&response_type=code&scope={}&access_type=offline&prompt=consent",
        client_id, redirect_uri, scope
    );
    
    Ok(url)
}

/// 完成 OAuth 登录
#[command]
pub fn antigravity_complete_oauth(code: String) -> Result<AntigravityAccountData, String> {
    // TODO: 实现真实的 OAuth token 交换
    // 这里需要调用 Google OAuth API 交换 code 获取 access_token 和 refresh_token
    
    // 模拟返回
    Ok(AntigravityAccountData {
        id: uuid::Uuid::new_v4().to_string(),
        email: format!("oauth_{}@gmail.com", &code[..6.min(code.len())]),
        name: Some("OAuth User".to_string()),
        refresh_token: format!("1//oauth_{}", code),
    })
}

/// 通过 Refresh Token 添加账号
#[command]
pub fn antigravity_add_by_token(refresh_token: String) -> Result<AntigravityAccountData, String> {
    // 验证 token 格式
    if !refresh_token.starts_with("1//") {
        return Err("Invalid token format".to_string());
    }
    
    // TODO: 实际实现中应该调用 Google API 验证 token 并获取用户信息
    
    Ok(AntigravityAccountData {
        id: uuid::Uuid::new_v4().to_string(),
        email: format!("token_{}@imported.local", &refresh_token[3..9.min(refresh_token.len())]),
        name: Some("Imported Account".to_string()),
        refresh_token,
    })
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
#[command]
pub fn select_db_file() -> Result<Option<String>, String> {
    // 暂不实现文件选择对话框，返回 None 让前端使用手动输入路径
    Ok(None)
}
