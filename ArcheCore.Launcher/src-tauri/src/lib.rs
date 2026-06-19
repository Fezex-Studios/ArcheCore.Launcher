// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::process::Command;
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn launch_game(token: String) -> Result<(), String> {
    Command::new("F:/Development/ProjectArcheCore/ArcheCore.Unity/bin/ArcheCore.Client/ArcheCore.Client.exe")
        .arg("-token")
        .arg(token)
        .spawn()
        .map_err(|e| e.to_string())?;

    Ok(())
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![greet, launch_game])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}