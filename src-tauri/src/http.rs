use crate::error::FetchError;
use tauri_plugin_http::reqwest::Client;
use tauri_plugin_http::reqwest::header::{HeaderMap, HeaderValue, ACCEPT, ACCEPT_LANGUAGE, ACCEPT_ENCODING, CACHE_CONTROL, PRAGMA, UPGRADE_INSECURE_REQUESTS};
use std::sync::LazyLock;
use std::time::Duration;

static HTTP_CLIENT: LazyLock<Client> = LazyLock::new(|| {
    create_client().expect("Failed to create HTTP client")
});

const USER_AGENT: &str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const TIMEOUT_SECS: u64 = 30;

fn create_browser_headers() -> HeaderMap {
    let mut headers = HeaderMap::new();

    // Standard browser headers
    headers.insert(ACCEPT, HeaderValue::from_static("text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8"));
    headers.insert(ACCEPT_LANGUAGE, HeaderValue::from_static("ja,en-US;q=0.9,en;q=0.8"));
    headers.insert(ACCEPT_ENCODING, HeaderValue::from_static("gzip, deflate, br"));
    headers.insert(CACHE_CONTROL, HeaderValue::from_static("no-cache"));
    headers.insert(PRAGMA, HeaderValue::from_static("no-cache"));
    headers.insert(UPGRADE_INSECURE_REQUESTS, HeaderValue::from_static("1"));

    // Sec-Ch-Ua headers (Client Hints)
    headers.insert("Sec-Ch-Ua", HeaderValue::from_static("\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\""));
    headers.insert("Sec-Ch-Ua-Mobile", HeaderValue::from_static("?0"));
    headers.insert("Sec-Ch-Ua-Platform", HeaderValue::from_static("\"Windows\""));

    // Sec-Fetch headers
    headers.insert("Sec-Fetch-Dest", HeaderValue::from_static("document"));
    headers.insert("Sec-Fetch-Mode", HeaderValue::from_static("navigate"));
    headers.insert("Sec-Fetch-Site", HeaderValue::from_static("none"));
    headers.insert("Sec-Fetch-User", HeaderValue::from_static("?1"));

    headers
}

pub fn create_client() -> Result<Client, FetchError> {
    Client::builder()
        .user_agent(USER_AGENT)
        .default_headers(create_browser_headers())
        .cookie_store(true)
        .gzip(true)
        .brotli(true)
        .deflate(true)
        .timeout(Duration::from_secs(TIMEOUT_SECS))
        .build()
        .map_err(FetchError::HttpError)
}

pub async fn fetch_page(url: &str) -> Result<String, FetchError> {
    let client = &*HTTP_CLIENT;
    let response = client.get(url).send().await?;

    if !response.status().is_success() {
        return Err(FetchError::HttpError(
            response.error_for_status().unwrap_err()
        ));
    }

    let html = response.text().await?;
    Ok(html)
}
