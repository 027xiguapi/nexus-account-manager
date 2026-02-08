use serde::{Deserialize, Serialize};

use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager}; // ✅ 添加 Manager

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Account {
    pub id: String,
    pub platform: String,
    pub name: Option<String>,
    pub email: String,
    pub avatar: Option<String>,
    pub is_active: bool,
    pub last_used_at: i64,
    pub created_at: i64,
    pub platform_data: serde_json::Value,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Storage {
    pub accounts: Vec<Account>,
    pub machine_id: Option<String>,
    pub account_machine_bindings: std::collections::HashMap<String, String>,
}

impl Storage {
    pub fn new() -> Self {
        Self {
            accounts: Vec::new(),
            machine_id: None,
            account_machine_bindings: std::collections::HashMap::new(),
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
        
        // Ensure directory exists
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

// Global configuration state for custom path
pub struct StorageConfig {
    pub custom_path: std::sync::Mutex<Option<PathBuf>>,
}

fn get_storage_path(app: &AppHandle) -> Result<PathBuf, String> {
    // Check if custom path is set in state
    if let Some(state) = app.try_state::<StorageConfig>() {
        if let Ok(custom_path) = state.custom_path.lock() {
            if let Some(path) = &*custom_path {
                return Ok(path.clone());
            }
        }
    }

    // Default path
    let app_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;
    
    Ok(app_dir.join("accounts.json"))
}

#[tauri::command]
pub fn set_storage_path(path: String, state: tauri::State<'_, StorageConfig>) -> Result<(), String> {
    let mut custom_path = state.custom_path.lock().map_err(|e| e.to_string())?;
    *custom_path = Some(PathBuf::from(path));
    Ok(())
}

#[tauri::command]
pub fn get_current_storage_path(app: AppHandle) -> Result<String, String> {
    let path = get_storage_path(&app)?;
    Ok(path.to_string_lossy().to_string())
}
