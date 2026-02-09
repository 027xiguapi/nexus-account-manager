//! 统一日志系统
//! 
//! 提供统一的日志输出接口，方便后续扩展到文件日志或其他日志系统

use std::fmt::Display;

/// 日志级别
#[allow(dead_code)]
pub enum LogLevel {
    Info,
    Warn,
    Error,
    Debug,
}

/// 输出信息日志
pub fn log_info<T: Display>(message: T) {
    println!("[INFO] {}", message);
}

/// 输出警告日志
pub fn log_warn<T: Display>(message: T) {
    println!("[WARN] {}", message);
}

/// 输出错误日志
pub fn log_error<T: Display>(message: T) {
    eprintln!("[ERROR] {}", message);
}

/// 输出调试日志
#[allow(dead_code)]
pub fn log_debug<T: Display>(message: T) {
    println!("[DEBUG] {}", message);
}
