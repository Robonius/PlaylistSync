## 2025-02-27 - [Security] Prevent CSV/Formula Injection in Papaparse Exports
**Vulnerability:** The application was using `papaparse` to export user-provided data directly to CSV without sanitizing string values that could be interpreted as formulas.
**Learning:** `papaparse`'s `unparse` function does not automatically sanitize strings that begin with `=`, `+`, `-`, or `@`. When these values are opened in spreadsheet applications (like Excel), they can execute malicious formulas (CSV/Formula Injection). Furthermore, `papaparse` accepts both arrays of objects and arrays of arrays, so any sanitization logic must handle both structures.
**Prevention:** Always implement a sanitization step before passing data to `Papa.unparse`. This sanitization should map over the rows and prepend a single quote (`'`) to any string fields starting with the aforementioned formula trigger characters.

## 2025-02-27 - [Security] Prevent Sensitive Information Leakage in Error Handling
**Vulnerability:** The application was catching raw Axios errors during API requests (e.g. Spotify and YouTube APIs) and throwing them directly up the chain to the UI. Axios error objects include the full `config` object which contains sensitive properties such as `Authorization` headers (e.g., Bearer tokens).
**Learning:** If an unexpected failure occurs and the raw Axios error is caught and propagated to the frontend or inadvertently logged to a service, it exposes sensitive tokens (like OAuth tokens or API keys) embedded within the request configuration.
**Prevention:** Implement an error sanitization utility (`sanitizeError`) that intercepts errors before they propagate. This utility strips out sensitive configuration properties from Axios errors, retaining only safe data (`message`, `status`, `data`, etc.) required for user feedback and non-sensitive debugging. Use this utility uniformly across all API request handlers.

## 2025-02-27 - [Security] Prevent CSRF via Missing OAuth State Validation
**Vulnerability:** The application was initiating OAuth authorization code flows for Spotify and Google but omitting the `state` parameter and failing to validate it upon the redirect callback.
**Learning:** Omitting or failing to validate the `state` parameter in OAuth flows leaves the application vulnerable to Cross-Site Request Forgery (CSRF) attacks. An attacker could trick a user's browser into completing an authorization flow initiated by the attacker, potentially linking the victim's account to the attacker's resources or vice versa.
**Prevention:** Always generate a cryptographically secure random `state` parameter during OAuth initiation, store it locally (e.g., in `localStorage` or a secure HTTP-only cookie), and append it to the authorization URL. Upon callback, verify that the `state` returned by the authorization server strictly matches the locally stored value. Clean up the stored state immediately after verification, regardless of success or failure.

## 2024-03-20 - [DevOps] Fix Docker Build and Runtime Environment Configuration
**Issue:** The project's Dockerfile was misconfigured (targeting pnpm instead of Bun) and failed to support Next.js standalone mode and runtime environment variable injection.
**Learning:** Next.js 15 standalone mode requires copying `.next/standalone` and `.next/static` to the runner image. Runtime environment variable injection ("No Baking" policy) in Next.js requires a client-side entrypoint (e.g., `public/env-config.js`) and a corresponding script tag in the root layout (`src/app/layout.tsx`) to load the variables into `window._env_`.
**Prevention:** Use `oven/bun:alpine` as the base image. Use a custom entrypoint (`docker/entrypoint.sh`) to generate `public/env-config.js` from environment variables. Ensure the runner user has write access to the `public` directory. Update `src/utils/env.ts` to prioritize `window._env_` over `process.env`.

## 2025-02-27 - [Security] Prevent Information Leakage in API Endpoints
**Vulnerability:** The application was exposing `error.message` directly in API route handlers (`src/app/api/...`), which could inadvertently leak sensitive system paths, API keys, or stack details wrapped in third-party library error messages (such as `axios`).
**Learning:** Returning `error.message` directly to the client from unhandled internal or external service exceptions violates safe error handling principles, as it can inadvertently disclose internals.
**Prevention:** Always replace unhandled or external error messages with hardcoded, generic strings (e.g., `'Error fetching Spotify playlist'`) at the HTTP boundary before sending a response payload to the client.

### Security Implementation Note: CSV Injection (Formula Injection)
*   **Vulnerability Pattern**: CSV Injection occurs when untrusted user input begins with mathematical or command execution characters (`=`, `+`, `-`, `@`, `\t`, `\r`) and is exported into CSV formats parsed by spreadsheet applications like Excel.
*   **Prevention Strategy**:
    *   Prepend a single quote (`'`) to string values beginning with vulnerable trigger characters.
    *   **Crucial Context**: When utilizing CSV parsers like `PapaParse`, it is vital to recursively sanitize *all* deeply nested properties and arrays within the data object structure *before* passing it to `Papa.unparse()`. Flat, one-level iteration is insufficient because the unparser logic might drill down or unwrap complex objects differently depending on configuration.

## 2025-02-27 - [Security] Prevent SSRF and Path Traversal via URL Interpolation
**Vulnerability:** The application was interpolating unvalidated user input (`playlistId` from query parameters) directly into backend API URLs (e.g., `https://api.spotify.com/v1/playlists/${playlistId}/tracks`).
**Learning:** If user input is not strictly validated, attackers can supply path traversal payloads (like `../me`) that manipulate the final URL constructed by the server. This causes the backend to make authorized requests (using the victim's OAuth token) to unintended endpoints (Server-Side Request Forgery). Trusting that the frontend only sends valid IDs is insufficient.
**Prevention:** Always implement strict server-side validation on route parameters or query parameters before using them to construct backend URLs. Use allowlists or tight regex patterns (e.g., `/^[a-zA-Z0-9]+$/` for Spotify Base62 IDs) to ensure the parameter contains only expected characters and no path traversal sequences.

## 2025-02-27 - [Security] Prevent Ghost Sessions and Inconsistent UI State (OAuth 401s)
**Vulnerability:** The application was catching 401 Unauthorized errors from Spotify and YouTube APIs (e.g., when a user revokes access from their provider settings) but failing to clear the local HttpOnly session cookies. This left the user in a "pseudo-connected" state, where the frontend UI indicated they were connected but API requests consistently failed.
**Learning:** Returning generic error messages to the client on 401s without managing local session state leads to broken UX and potential edge cases where invalid tokens persist indefinitely.
**Prevention:** Always intercept 401 status codes in backend API routes. When a 401 occurs, explicitly clear the associated access and refresh tokens (e.g., using `response.cookies.delete(...)`). Additionally, update the frontend error handling to re-fetch and apply the current authentication status when a 401 is encountered, immediately prompting the user to re-authenticate.
