use tauri::Manager;
use url::Url;

mod error;
mod http;
mod parsers;

use error::FetchError;
use parsers::{chordwiki, gakkime, jtotal, ufret, FetchedChordSheet};

/// Determine which parser to use based on URL domain
fn get_parser(url: &str) -> Result<fn(&str) -> Result<FetchedChordSheet, FetchError>, FetchError> {
    let parsed = Url::parse(url).map_err(|_| FetchError::UnsupportedSite(url.to_string()))?;
    let host = parsed.host_str().unwrap_or("");

    if host == "ufret.jp" || host.ends_with(".ufret.jp") {
        Ok(ufret::parse)
    } else if host == "j-total.net" || host.ends_with(".j-total.net") {
        Ok(jtotal::parse)
    } else if host == "gakki.me" || host.ends_with(".gakki.me") {
        Ok(gakkime::parse)
    } else if host == "chordwiki.org" || host.ends_with(".chordwiki.org") {
        Ok(chordwiki::parse)
    } else {
        Err(FetchError::UnsupportedSite(url.to_string()))
    }
}

/// Fetch chord sheet from URL (backend HTTP request)
#[tauri::command]
async fn fetch_chord_sheet(url: String) -> Result<FetchedChordSheet, String> {
    // Get appropriate parser
    let parser = get_parser(&url).map_err(|e| e.to_string())?;

    // Fetch HTML
    let html = http::fetch_page(&url).await.map_err(|e| e.to_string())?;

    // Parse content
    let mut result = parser(&html).map_err(|e| e.to_string())?;
    result.source_url = url;

    Ok(result)
}

/// Parse HTML content into chord sheet (for frontend-fetched HTML)
#[tauri::command]
fn parse_chord_sheet(url: String, html: String) -> Result<FetchedChordSheet, String> {
    // Get appropriate parser
    let parser = get_parser(&url).map_err(|e| e.to_string())?;

    // Parse content
    let mut result = parser(&html).map_err(|e| e.to_string())?;
    result.source_url = url;

    Ok(result)
}

/// Get list of supported sites
#[tauri::command]
fn get_supported_sites() -> Vec<SupportedSite> {
    vec![
        SupportedSite {
            name: "U-Fret".to_string(),
            domain: "ufret.jp".to_string(),
            example_url: "https://www.ufret.jp/song.php?data=12345".to_string(),
        },
        SupportedSite {
            name: "J-Total".to_string(),
            domain: "j-total.net".to_string(),
            example_url: "https://music.j-total.net/data/012/345_song.html".to_string(),
        },
        SupportedSite {
            name: "楽器.me".to_string(),
            domain: "gakufu.gakki.me".to_string(),
            example_url: "https://gakufu.gakki.me/m/data/M00211.html".to_string(),
        },
        // ChordWiki excluded from auto-fetch due to Cloudflare - use manual HTML input
    ]
}

#[derive(serde::Serialize)]
struct SupportedSite {
    name: String,
    domain: String,
    example_url: String,
}

/// Get application version
#[tauri::command]
fn get_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![
            fetch_chord_sheet,
            parse_chord_sheet,
            get_supported_sites,
            get_version
        ])
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
