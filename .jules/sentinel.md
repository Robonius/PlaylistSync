## 2024-05-19 - [Mask Sensitive Token Inputs in UI]
**Vulnerability:** Input fields for sensitive tokens like "Spotify Access Token" and "YouTube API Key" were using `type="text"`, which exposed these values as plaintext on the screen.
**Learning:** Hardcoded text inputs for API keys and tokens expose credentials to shoulder-surfing or screen-sharing risks. We must ensure UI components support password masking and explicitly enable them for sensitive variables.
**Prevention:** Always use `type="password"` or implement a secure input component for user-provided secrets, tokens, or passwords to prevent plaintext leakage in the client-side UI.
