use crate::error::FetchError;
use reqwest::Client;
use std::time::Duration;

const USER_AGENT: &str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const TIMEOUT_SECS: u64 = 30;

pub fn create_client() -> Result<Client, FetchError> {
    Client::builder()
        .user_agent(USER_AGENT)
        .timeout(Duration::from_secs(TIMEOUT_SECS))
        .build()
        .map_err(FetchError::HttpError)
}

pub async fn fetch_page(url: &str) -> Result<String, FetchError> {
    let client = create_client()?;
    let response = client.get(url).send().await?;

    if !response.status().is_success() {
        return Err(FetchError::HttpError(
            response.error_for_status().unwrap_err()
        ));
    }

    let html = response.text().await?;
    Ok(html)
}
