//! Antigravity IDE 进程控制
//! 
//! 提供启动、关闭、检测 Antigravity IDE 进程的功能

use std::process::Command;
use std::thread;
use std::time::Duration;

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

/// 检查 Antigravity IDE 是否正在运行
pub fn is_antigravity_running() -> bool {
    #[cfg(target_os = "windows")]
    {
        let output = Command::new("tasklist")
            .args(&["/FI", "IMAGENAME eq Antigravity.exe"])
            .output();
        
        if let Ok(output) = output {
            let stdout = String::from_utf8_lossy(&output.stdout);
            stdout.contains("Antigravity.exe")
        } else {
            false
        }
    }
    
    #[cfg(target_os = "macos")]
    {
        let output = Command::new("pgrep")
            .arg("-f")
            .arg("Antigravity")
            .output();
        
        if let Ok(output) = output {
            !output.stdout.is_empty()
        } else {
            false
        }
    }
    
    #[cfg(target_os = "linux")]
    {
        let output = Command::new("pgrep")
            .arg("-f")
            .arg("antigravity")
            .output();
        
        if let Ok(output) = output {
            !output.stdout.is_empty()
        } else {
            false
        }
    }
}

/// 关闭 Antigravity IDE 进程
/// 
/// timeout_secs: 等待进程关闭的超时时间（秒）
pub fn close_antigravity(timeout_secs: u64) -> Result<(), String> {
    if !is_antigravity_running() {
        return Ok(());
    }
    
    println!("[Process] Closing Antigravity IDE...");
    
    #[cfg(target_os = "windows")]
    {
        // 使用 taskkill 优雅关闭
        let _ = Command::new("taskkill")
            .args(&["/IM", "Antigravity.exe", "/T"])
            .creation_flags(0x08000000) // CREATE_NO_WINDOW
            .output();
        
        // 等待进程关闭
        for i in 0..timeout_secs {
            thread::sleep(Duration::from_secs(1));
            if !is_antigravity_running() {
                println!("[Process] Antigravity closed after {} seconds", i + 1);
                return Ok(());
            }
        }
        
        // 如果还没关闭，强制终止
        println!("[Process] Force killing Antigravity...");
        let _ = Command::new("taskkill")
            .args(&["/F", "/IM", "Antigravity.exe", "/T"])
            .creation_flags(0x08000000)
            .output();
        
        thread::sleep(Duration::from_secs(1));
        
        if is_antigravity_running() {
            return Err("Failed to close Antigravity".to_string());
        }
    }
    
    #[cfg(any(target_os = "macos", target_os = "linux"))]
    {
        // 使用 pkill 优雅关闭
        let _ = Command::new("pkill")
            .arg("-TERM")
            .arg("Antigravity")
            .output();
        
        // 等待进程关闭
        for i in 0..timeout_secs {
            thread::sleep(Duration::from_secs(1));
            if !is_antigravity_running() {
                println!("[Process] Antigravity closed after {} seconds", i + 1);
                return Ok(());
            }
        }
        
        // 如果还没关闭，强制终止
        println!("[Process] Force killing Antigravity...");
        let _ = Command::new("pkill")
            .arg("-KILL")
            .arg("Antigravity")
            .output();
        
        thread::sleep(Duration::from_secs(1));
        
        if is_antigravity_running() {
            return Err("Failed to close Antigravity".to_string());
        }
    }
    
    Ok(())
}

/// 启动 Antigravity IDE
pub fn start_antigravity() -> Result<(), String> {
    println!("[Process] Starting Antigravity IDE...");
    
    #[cfg(target_os = "windows")]
    {
        // 在 Windows 上查找 Antigravity 安装路径
        let possible_paths = vec![
            // LOCALAPPDATA (通常是用户安装)
            std::env::var("LOCALAPPDATA").ok().map(|p| format!("{}\\Programs\\Antigravity\\Antigravity.exe", p)),
            // Program Files
            Some("C:\\Program Files\\Antigravity\\Antigravity.exe".to_string()),
            Some("C:\\Program Files (x86)\\Antigravity\\Antigravity.exe".to_string()),
            // 用户目录下的常见位置
            std::env::var("USERPROFILE").ok().map(|p| format!("{}\\AppData\\Local\\Programs\\Antigravity\\Antigravity.exe", p)),
            // Scoop 安装路径
            std::env::var("USERPROFILE").ok().map(|p| format!("{}\\scoop\\apps\\antigravity\\current\\Antigravity.exe", p)),
            // Chocolatey 安装路径
            Some("C:\\ProgramData\\chocolatey\\lib\\antigravity\\tools\\Antigravity.exe".to_string()),
        ];
        
        println!("[Process] Searching for Antigravity executable...");
        for path_opt in possible_paths {
            if let Some(path) = path_opt {
                println!("[Process] Checking: {}", path);
                if std::path::Path::new(&path).exists() {
                    println!("[Process] Found Antigravity at: {}", path);
                    Command::new(&path)
                        .creation_flags(0x08000000) // CREATE_NO_WINDOW
                        .spawn()
                        .map_err(|e| format!("Failed to start Antigravity: {}", e))?;
                    
                    println!("[Process] Antigravity started successfully");
                    return Ok(());
                } else {
                    println!("[Process] Not found at: {}", path);
                }
            }
        }
        
        println!("[Process] Antigravity executable not found in any standard location");
        println!("[Process] Please ensure Antigravity is installed");
        return Err("Antigravity executable not found. Please ensure Antigravity IDE is installed.".to_string());
    }
    
    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg("-a")
            .arg("Antigravity")
            .spawn()
            .map_err(|e| format!("Failed to start Antigravity: {}", e))?;
        
        println!("[Process] Antigravity started");
        Ok(())
    }
    
    #[cfg(target_os = "linux")]
    {
        Command::new("antigravity")
            .spawn()
            .map_err(|e| format!("Failed to start Antigravity: {}", e))?;
        
        println!("[Process] Antigravity started");
        Ok(())
    }
}
