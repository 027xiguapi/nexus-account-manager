use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager}; // ✅ 添加 Manager

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Account {
    pub id: String,
    pub platform: String,
    pub name: String,
    pub email: Option<String>,
    pub is_active: bool,
    pub created_at: String,
    pub updated_at: String,
    pub tags: Option<Vec<String>>,
    pub group: Option<String>,
    pub platform_data: HashMap<String, serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Storage {
    pub accounts: Vec<Account>,
}

impl Storage {
    pub fn new() -> Self {
        Self {
            accounts: Vec::new(),
        }
    }

    pub fn load(app: &AppHandle) -> Result<Self, String> {
        let path = get_storage_path(app)?;
        
        if !path.exists() {
            return Ok(Self::new());
        }

        let content = fs::read_to_string(&path)
            .map_err(|e| format!("Failed to read storage: {}", e))?;
        
        let storage: Storage = serde_json::from_str(&content)
            .map_err(|e| format!("Failed to parse storage: {}", e))?;
        
        Ok(storage)
    }

    pub fn save(&self, app: &AppHandle) -> Result<(), String> {
        let path = get_storage_path(app)?;
        
        // 确保目录存在
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent)
                .map_err(|e| format!("Failed to create directory: {}", e))?;
        }

        let content = serde_json::to_string_pretty(self)
            .map_err(|e| format!("Failed to serialize storage: {}", e))?;
        
        fs::write(&path, content)
            .map_err(|e| format!("Failed to write storage: {}", e))?;
        
        Ok(())
    }
}

fn get_storage_path(app: &AppHandle) -> Result<PathBuf, String> {
    let app_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;
    
    Ok(app_dir.join("accounts.json"))
}
