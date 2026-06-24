## 2024-05-19 - [Mask Sensitive Token Inputs in UI]
**Vulnerability:** Input fields for sensitive tokens like "Spotify Access Token" and "YouTube API Key" were using `type="text"`, which exposed these values as plaintext on the screen.
**Learning:** Hardcoded text inputs for API keys and tokens expose credentials to shoulder-surfing or screen-sharing risks. We must ensure UI components support password masking and explicitly enable them for sensitive variables.
**Prevention:** Always use `type="password"` or implement a secure input component for user-provided secrets, tokens, or passwords to prevent plaintext leakage in the client-side UI.

## 2024-05-19 - [Sanitize Error Logs]
**Vulnerability:** The `error.message` object, when originating from libraries like Axios, could potentially be logged to the console using `console.error()`.
**Learning:** Depending on the wrapper, Axios `error.message` responses may append sensitive information to the stack trace, exposing the request URL or authorization headers to the client-side console.
**Prevention:** Avoid logging the `error.message` directly from network error catches in client side logs, use a sanitized, generic output string.
