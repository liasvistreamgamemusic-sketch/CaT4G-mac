use thiserror::Error;

#[derive(Error, Debug)]
pub enum FetchError {
    #[error("HTTP request failed: {0}")]
    HttpError(#[from] tauri_plugin_http::reqwest::Error),

    #[error("Unsupported site: {0}")]
    UnsupportedSite(String),

    #[error("Parse error: {0}")]
    ParseError(String),

    #[error("Element not found: {0}")]
    ElementNotFound(String),

    #[error("Invalid URL format: {0}")]
    InvalidUrl(String),

    #[error("Timeout while fetching: {0}")]
    Timeout(String),
}

impl From<FetchError> for String {
    fn from(error: FetchError) -> Self {
        error.to_string()
    }
}
