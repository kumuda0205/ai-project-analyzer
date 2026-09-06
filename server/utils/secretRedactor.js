/**
 * Utility to detect and redact sensitive secret values, API keys, passwords, and tokens
 * from source code text prior to sending to AI models.
 */

const SECRET_PATTERNS = [
  // Anthropic API keys (sk-ant-api03-...)
  /sk-ant-[a-zA-Z0-9_-]{20,}/g,
  // OpenAI API keys (sk-...)
  /sk-[a-zA-Z0-9]{32,}/g,
  // AWS Access Key IDs
  /AKIA[0-9A-Z]{16}/g,
  // AWS Secret Access Keys (generic pattern after AWS key)
  /(aws_secret_access_key|aws_access_key_id)\s*[:=]\s*["']?[A-Za-z0-9/+=]{20,}["']?/gi,
  // GitHub Personal Access Tokens & Apps
  /ghp_[a-zA-Z0-9]{36}/g,
  /gho_[a-zA-Z0-9]{36}/g,
  /github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}/g,
  // Generic Bearer Tokens
  /Bearer\s+[a-zA-Z0-9\-\._~\+\/]+=*/gi,
  // Private Key blocks
  /-----BEGIN [A-Z ]+ PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+ PRIVATE KEY-----/g,
  // Key/Value assignments for secrets, passwords, apikeys, db pass
  /(api_key|apikey|secret_key|secretkey|access_token|auth_token|db_pass|database_password|password|passwd|client_secret)\s*[:=]\s*["']([^"'\n\r]{4,})["']/gi,
  // Database connection strings containing passwords
  /(mongodb(\+srv)?|postgres|postgresql|mysql|mssql):\/\/[^:\s]+:([^@\s]+)@[^\s]+/gi,
];

export function redactSecrets(content) {
  if (typeof content !== 'string' || !content) {
    return content;
  }

  let redacted = content;

  // Redact RSA/PEM Private Keys block specifically
  redacted = redacted.replace(
    /-----BEGIN [A-Z ]+ PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+ PRIVATE KEY-----/g,
    '[REDACTED_PRIVATE_KEY]'
  );

  // Apply general secret pattern replacements
  for (const pattern of SECRET_PATTERNS) {
    redacted = redacted.replace(pattern, (match, p1, p2) => {
      if (p1 && p2) {
        // Form: key = "value"
        return `${p1} = "[REDACTED_SECRET]"`;
      }
      return '[REDACTED_SECRET]';
    });
  }

  return redacted;
}
