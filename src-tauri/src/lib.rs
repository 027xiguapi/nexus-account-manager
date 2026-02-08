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
            // Initialize custom storage config state
            app.manage(core::StorageConfig {
                custom_path: Mutex::new(None), // TODO: Load from persistent settings if possible
            });

            // Initialize storage
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
            core::storage::set_storage_path,
            core::storage::get_current_storage_path,
            import::import_from_db,
            machine::get_machine_id,
            machine::set_machine_id,
            machine::bind_machine_id,
            machine::unbind_machine_id,
            machine::get_machine_id_for_account,
            machine::get_all_machine_id_bindings,
            // Antigravity 命令
            antigravity::antigravity_prepare_oauth_url,
            antigravity::antigravity_complete_oauth,
            antigravity::antigravity_add_by_token,
            antigravity::antigravity_scan_databases,
            antigravity::select_db_file,
            // Kiro 命令
            kiro::kiro_start_builderid_login,
            kiro::kiro_poll_builderid_auth,
            kiro::kiro_cancel_builderid_login,
            kiro::kiro_social_login,
            kiro::kiro_import_sso_token,
            kiro::kiro_verify_credentials,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
