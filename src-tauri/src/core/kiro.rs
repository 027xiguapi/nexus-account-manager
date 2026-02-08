use serde::{Deserialize, Serialize};
use reqwest::Client;
use std::time::{Duration, SystemTime, UNIX_EPOCH};
// use std::collections::HashMap; // removed

const OIDC_BASE_URL: &str = "https://oidc.us-east-1.amazonaws.com";
const START_URL: &str = "https://view.awsapps.com/start";
const REGION: &str = "us-east-1";

// User Agent matching Kiro's implementation
const CLI_USER_AGENT: &str = "aws-cli/2.15.0 Python/3.11.6 Windows/10 exe/AMD64 prompt/off command/codecatalyst.login";

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct KiroTokenData {
    pub access_token: String,
    pub refresh_token: Option<String>,
    pub expires_in: i64,
    pub client_id: Option<String>,
    pub client_secret: Option<String>,
    pub region: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[allow(non_snake_case)]
struct ClientRegistrationResponse {
    clientId: String,
    clientSecret: String,
    clientIdIssuedAt: i64,
    clientSecretExpiresAt: i64,
}

// ... imports
use tokio::sync::mpsc::Sender;
use std::sync::Mutex;

// ... existing structs

pub struct DeepLinkState {
    pub sender: Mutex<Option<Sender<String>>>,
}

#[derive(Debug, Serialize, Deserialize)]
#[allow(non_snake_case)]
pub struct DeviceAuthResponse {
    pub deviceCode: String,
    pub userCode: String,
    pub verificationUri: String,
    pub verificationUriComplete: Option<String>,
    pub expiresIn: i64,
    pub interval: i64,
}

#[derive(Debug, Serialize, Deserialize)]
struct TokenResponse {
    access_token: String,
    refresh_token: Option<String>,
    expires_in: i64,
    token_type: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ErrorResponse {
    error: String,
    error_description: Option<String>,
}

fn get_client() -> Client {
    Client::builder()
        .timeout(Duration::from_secs(30))
        .build()
        .unwrap_or_default()
}

pub async fn register_client() -> Result<(String, String), String> {
    let client = get_client();
    let url = format!("{}/client/register", OIDC_BASE_URL);
    
    let payload = serde_json::json!({
        "clientName": "Nexus Account Manager",
        "clientType": "public",
        "scopes": [
            "codewhisperer:analysis", 
            "codewhisperer:completions", 
            "codewhisperer:conversations", 
            "codewhisperer:taskassist", 
            "codewhisperer:transformations"
        ],
        "grantTypes": ["urn:ietf:params:oauth:grant-type:device_code", "refresh_token"],
        "issuerUrl": START_URL
    });

    let res = client.post(&url)
        .json(&payload)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !res.status().is_success() {
        return Err(format!("Register failed: {}", res.status()));
    }

    let data: ClientRegistrationResponse = res.json().await.map_err(|e| e.to_string())?;
    Ok((data.clientId, data.clientSecret))
}

pub async fn start_device_authorization(client_id: &str, client_secret: &str) -> Result<DeviceAuthResponse, String> {
    let client = get_client();
    let url = format!("{}/device_authorization", OIDC_BASE_URL);

    let payload = serde_json::json!({
        "clientId": client_id,
        "clientSecret": client_secret,
        "startUrl": START_URL
    });

    let res = client.post(&url)
        .json(&payload)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !res.status().is_success() {
        return Err(format!("Device auth failed: {}", res.status()));
    }

    let data: DeviceAuthResponse = res.json().await.map_err(|e| e.to_string())?;
    Ok(data)
}

pub async fn poll_token(
    client_id: &str, 
    client_secret: &str, 
    device_code: &str, 
    _interval_secs: u64
) -> Result<KiroTokenData, String> {
    let client = get_client();
    let url = format!("{}/token", OIDC_BASE_URL);
    
    // Poll loop needs to be handled by caller or we loop once here?
    // Since this is an async function called from command, we can loop here with sleep.
    // But we need timeout.
    
    // In actual implementation (command wrapper), we might want to call this ONCE per interval.
    // But for simplicity, let's just make a single request function check_token_status.
    
    let payload = serde_json::json!({
        "clientId": client_id,
        "clientSecret": client_secret,
        "grantType": "urn:ietf:params:oauth:grant-type:device_code",
        "deviceCode": device_code
    });

    let res = client.post(&url)
        .json(&payload)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if res.status().is_success() {
        let data: TokenResponse = res.json().await.map_err(|e| e.to_string())?;
        return Ok(KiroTokenData {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_in: data.expires_in,
            client_id: Some(client_id.to_string()),
            client_secret: Some(client_secret.to_string()),
            region: REGION.to_string(),
        });
    }

    // Handle errors (pending, slow_down)
    let status = res.status();
    let err_text = res.text().await.unwrap_or_default();
    // Try parse json error
    if let Ok(json_err) = serde_json::from_str::<ErrorResponse>(&err_text) {
        if json_err.error == "authorization_pending" {
            return Err("pending".to_string());
        }
        if json_err.error == "slow_down" {
            return Err("slow_down".to_string());
        }
        return Err(format!("Auth error: {}", json_err.error));
    }

    Err(format!("HTTP Error {}: {}", status, err_text))
}

pub async fn refresh_token(
    refresh_token: &str,
    client_id: &str, 
    client_secret: &str
) -> Result<KiroTokenData, String> {
    let client = get_client();
    let url = format!("{}/token", OIDC_BASE_URL);
    
    let payload = serde_json::json!({
        "clientId": client_id,
        "clientSecret": client_secret,
        "grantType": "refresh_token",
        "refreshToken": refresh_token
    });

    println!("Refreshing Kiro token...");

    let res = client.post(&url)
        .json(&payload)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !res.status().is_success() {
        return Err(format!("Refresh failed: {}", res.status()));
    }

    let data: TokenResponse = res.json().await.map_err(|e| e.to_string())?;
    Ok(KiroTokenData {
        access_token: data.access_token,
        refresh_token: data.refresh_token.or(Some(refresh_token.to_string())),
        expires_in: data.expires_in,
        client_id: Some(client_id.to_string()),
        client_secret: Some(client_secret.to_string()),
        region: REGION.to_string(),
    })
}

// === Quota / Usage Logic ===

#[derive(Debug, Serialize, Deserialize)]
pub struct KiroQuotaData {
    pub subscription_type: String,
    pub subscription_title: String,
    pub total_limit: f64,
    pub current_usage: f64,
    pub percent_used: f64,
    pub days_remaining: Option<i64>,
    pub email: Option<String>,
    pub user_id: Option<String>,
}

pub async fn get_usage_limits(access_token: &str) -> Result<KiroQuotaData, String> {
    // Determine REST API Base URL
    // Standard: https://us-east-1.codewhisperer.aws.amazon.com
    // Fallback: https://codewhisperer.us-east-1.amazonaws.com
    
    let url = "https://us-east-1.codewhisperer.aws.amazon.com/getUsageLimits";
    let client = get_client();
    
    let params = [
        ("origin", "AI_EDITOR"),
        ("resourceType", "AGENTIC_REQUEST"),
        ("isEmailRequired", "true")
    ];
    
    // We need to match Kiro's User-Agent perfectly to avoid 403
    let res = client.get(url)
        .query(&params)
        .header("Authorization", format!("Bearer {}", access_token))
        .header("Accept", "application/json")
        .header("User-Agent", CLI_USER_AGENT)
        .header("x-amz-user-agent", format!("{} app/AmazonQ-For-CLI", CLI_USER_AGENT))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !res.status().is_success() {
        return Err(format!("Usage API failed: {}", res.status()));
    }

    let json: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
    
    // Parse the complex response structure manually to extract key metrics
    // Refer to Kiro's parsing logic (lines 2045-2067 in index.ts)
    
    // Default values
    let mut total_limit = 0.0;
    let mut current_usage = 0.0;
    
    if let Some(breakdown_list) = json.get("usageBreakdownList").and_then(|v| v.as_array()) {
        for item in breakdown_list {
            let resource_type = item.get("resourceType").or(item.get("type")).and_then(|v| v.as_str());
            if resource_type == Some("CREDIT") {
                // Base
                total_limit += item.get("usageLimitWithPrecision").and_then(|v| v.as_f64()).unwrap_or(0.0);
                current_usage += item.get("currentUsageWithPrecision").and_then(|v| v.as_f64()).unwrap_or(0.0);
                
                // Free Trial
                if let Some(ft) = item.get("freeTrialInfo") {
                    if ft.get("freeTrialStatus").and_then(|v| v.as_str()) == Some("ACTIVE") {
                       total_limit += ft.get("usageLimitWithPrecision").and_then(|v| v.as_f64()).unwrap_or(0.0);
                       current_usage += ft.get("currentUsageWithPrecision").and_then(|v| v.as_f64()).unwrap_or(0.0);
                    }
                }
                
                // Bonuses
                if let Some(bonuses) = item.get("bonuses").and_then(|v| v.as_array()) {
                    for b in bonuses {
                        if b.get("status").and_then(|v| v.as_str()) == Some("ACTIVE") {
                            total_limit += b.get("usageLimitWithPrecision").and_then(|v| v.as_f64()).unwrap_or(0.0);
                            current_usage += b.get("currentUsageWithPrecision").and_then(|v| v.as_f64()).unwrap_or(0.0);
                        }
                    }
                }
            }
        }
    }

    let sub_title = json.pointer("/subscriptionInfo/subscriptionTitle")
        .and_then(|v| v.as_str()).unwrap_or("Free").to_string();
    
    let sub_type = if sub_title.to_uppercase().contains("PRO") { "Pro".to_string() } else { "Free".to_string() };

    let mut days_remaining = None;
    if let Some(reset_date_str) = json.get("nextDateReset").and_then(|v| v.as_str()) {
        if let Ok(date) = chrono::DateTime::parse_from_rfc3339(reset_date_str) {
             let now = chrono::Utc::now();
             let duration = date.with_timezone(&chrono::Utc) - now;
             days_remaining = Some(duration.num_days());
        }
    } else if let Some(reset_ts) = json.get("nextDateReset").and_then(|v| v.as_i64()) {
        let now = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs() as i64;
        let diff = reset_ts - now;
        days_remaining = Some(diff / 86400);
    }
    
    // Parse User Info
    let email = json.pointer("/userInfo/email").and_then(|v| v.as_str()).map(|s| s.to_string());
    let user_id = json.pointer("/userInfo/userId").and_then(|v| v.as_str()).map(|s| s.to_string());

    Ok(KiroQuotaData {
        subscription_type: sub_type,
        subscription_title: sub_title,
        total_limit,
        current_usage,
        percent_used: if total_limit > 0.0 { current_usage / total_limit } else { 0.0 },
        days_remaining,
        email,
        user_id,
    })
}
