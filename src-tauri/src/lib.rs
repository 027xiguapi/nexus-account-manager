mod core;
mod commands;

use commands::*;
use core::Storage;
use std::sync::Mutex;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // 初始化存储
            let storage = Storage::load(&app.handle())
                .unwrap_or_else(|e| {
                    eprintln!("Failed to load storage: {}", e);
                    Storage::new()
                });
            
            app.manage(AppState {
                storage: Mutex::new(storage),
            });
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_accounts,
            add_account,
            update_account,
            delete_account,
            export_accounts,
            import_accounts,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
