// Show console window in debug mode for logging
#![cfg_attr(all(not(debug_assertions), not(feature = "console")), windows_subsystem = "windows")]

fn main() {
    nexus_account_manager_lib::run()
}
