## 2024-05-19 - [Mask Sensitive Token Inputs in UI]
**Vulnerability:** Input fields for sensitive tokens like "Spotify Access Token" and "YouTube API Key" were using `type="text"`, which exposed these values as plaintext on the screen.
**Learning:** Hardcoded text inputs for API keys and tokens expose credentials to shoulder-surfing or screen-sharing risks. We must ensure UI components support password masking and explicitly enable them for sensitive variables.
**Prevention:** Always use `type="password"` or implement a secure input component for user-provided secrets, tokens, or passwords to prevent plaintext leakage in the client-side UI.
## 2024-05-24 - [Critical/High] Prevent Axios Config Leakage in Error Bubbling
**Vulnerability:** Raw `axios` error objects were being thrown from `src/utils/api.ts` directly up to the React components (`src/pages/Index.tsx`).
**Learning:** `axios` error objects contain a `config` object which holds sensitive data like request headers (e.g., `Authorization: Bearer <token>`). Throwing this raw object can inadvertently leak authentication tokens to error trackers, logging systems, or the UI if not explicitly handled.
**Prevention:** Standardized error handling by implementing a `sanitizeError` utility function. This utility creates a new Error object and explicitly extracts only safe fields (like `message`, `response.status`, and `response.data`), stripping away the sensitive `config` object entirely before throwing the error further up the chain.
