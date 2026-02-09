mod core;
mod commands;
mod utils;

use commands::*;
use core::Storage;
use std::sync::Mutex;
use tauri::{Manager, Emitter};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
            let _ = app.emit("single-instance", args.clone());
            
            if let Some(url) = args.iter().find(|a| a.starts_with("kiro://")) {
                use tauri::Manager;
                match app.state::<core::kiro::DeepLinkState>().sender.lock() {
                    Ok(sender_guard) => {
                        if let Some(sender) = sender_guard.as_ref() {
                            let _ = sender.try_send(url.clone());
                        }
                    },
                    Err(_) => {}
                }
            }
        }))
        .setup(|app| {
            app.manage(core::StorageConfig {
                custom_path: std::sync::Mutex::new(None),
            });
            app.manage(core::kiro::DeepLinkState {
                sender: std::sync::Mutex::new(None),
            });

            // Windows Registry for Deep Link
            #[cfg(target_os = "windows")]
            {
                use winreg::enums::*;
                use winreg::RegKey;
                use std::env;

                let hkcu = RegKey::predef(HKEY_CURRENT_USER);
                let path = std::path::Path::new("Software").join("Classes").join("kiro");
                let (key, _) = hkcu.create_subkey(&path).unwrap_or((hkcu.open_subkey(&path).unwrap(), winreg::enums::RegDisposition::REG_OPENED_EXISTING_KEY));
                
                let _ = key.set_value("", &"URL:Kiro Protocol");
                let _ = key.set_value("URL Protocol", &"");
                
                let (cmd_key, _) = key.create_subkey("shell\\open\\command").unwrap();
                if let Ok(exe_path) = env::current_exe() {
                    let cmd = format!("\"{}\" \"%1\"", exe_path.to_string_lossy());
                    let _ = cmd_key.set_value("", &cmd);
                }
            }

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
            core::storage::select_storage_directory,
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
            antigravity::antigravity_refresh_token,
            antigravity::antigravity_get_quota,
            antigravity::antigravity_scan_databases,
            antigravity::select_db_file,
            antigravity::antigravity_switch_account,
            // Kiro 命令
            kiro::kiro_start_device_auth,
            kiro::kiro_poll_token,
            kiro::kiro_check_quota,
            kiro::kiro_refresh_token,
            kiro::kiro_cancel_auth,
            kiro::kiro_import_sso_token,
            kiro::kiro_verify_credentials,
            kiro::kiro_social_login,
            kiro::switch_kiro_account,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
