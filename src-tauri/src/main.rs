// Show console window in debug mode for logging
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    nexus_account_manager_lib::run()
}
