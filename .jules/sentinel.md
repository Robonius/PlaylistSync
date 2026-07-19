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
## 2025-02-27 - [Test] Verify OAuth flow with Playwright
**Goal:** Verify OAuth authentication flows locally using playwright.
**Learning:** We can simulate clicks on the UI and check if the page correctly redirects to `accounts.spotify.com` and `accounts.google.com` using the credentials in the `.env` file.
**Prevention:** If testing remotely, use a tool like Playwright.
## 2025-02-27 - [Configuration] Handling differing Redirect URIs
**Issue:** Spotify required  while Google required  for redirect URIs during OAuth flows. A single dynamic  led to mismatch errors based on how the user loaded the web page.
**Prevention:** Split the single  into  and  and pass these explicit URLs directly in the OAuth request rather than relying on  or the request url.

## 2025-02-27 - [Configuration] Handling differing Redirect URIs
**Issue:** Spotify required `127.0.0.1` while Google required `localhost` for redirect URIs during OAuth flows. A single dynamic `REDIRECT_URI` led to mismatch errors based on how the user loaded the web page.
**Prevention:** Split the single `REDIRECT_URI` into `SPOTIFY_REDIRECT_URI` and `GOOGLE_REDIRECT_URI` and pass these explicit URLs directly in the OAuth request rather than relying on `window.location.origin` or the request url.

## 2025-02-27 - [Security] Prevent Ghost Sessions and Inconsistent UI State (OAuth 401s)
**Vulnerability:** The application was catching 401 Unauthorized errors from Spotify and YouTube APIs (e.g., when a user revokes access from their provider settings) but failing to clear the local HttpOnly session cookies. This left the user in a "pseudo-connected" state, where the frontend UI indicated they were connected but API requests consistently failed.
**Learning:** Returning generic error messages to the client on 401s without managing local session state leads to broken UX and potential edge cases where invalid tokens persist indefinitely.
**Prevention:** Always intercept 401 status codes in backend API routes. When a 401 occurs, explicitly clear the associated access and refresh tokens (e.g., using `response.cookies.delete(...)`). Additionally, update the frontend error handling to re-fetch and apply the current authentication status when a 401 is encountered, immediately prompting the user to re-authenticate.

### API Strict Token Payload Rules (Spotify & Google)
When interacting with OAuth token endpoints for Spotify and Google, strict payload formatting must be adhered to prevent HTTP 400 Bad Request errors:
1. **Content-Type**: Both endpoints strictly require `Content-Type: application/x-www-form-urlencoded`.
2. **Payload Serialization**: The body payload MUST be serialized using `URLSearchParams.toString()` (or native URL encoding). Passing raw JSON or a `URLSearchParams` object directly to `fetch` can cause stringification issues or truncate special characters (like those found in Google refresh tokens).
3. **Spotify Auth Header**: Spotify requires the client credentials to be passed in the `Authorization` header as a Base64-encoded string: `Basic base64(client_id:client_secret)`.
4. **Google Body Auth**: Google does NOT use the Basic Auth header. Instead, `client_id` and `client_secret` must be included directly within the URL-encoded body parameters.
## SSRF and Token Leakage via API Pagination
*   **Vulnerability:** When handling paginated responses from external APIs (like Spotify), directly using the provided `next` URL in subsequent requests without validation can lead to Server-Side Request Forgery (SSRF) and token leakage. If the initial response is manipulated or the upstream API is compromised, the application might send requests (including sensitive Bearer tokens) to an attacker-controlled domain.
*   **Prevention:** Always validate next-page URLs returned from external APIs before using them. Ensure they start with the expected base URL (e.g., `if (!url.startsWith('https://api.spotify.com/')) { break; }`).

## 2025-02-27 - [Security] Validate API Payloads and Query Parameters
**Vulnerability:** API routes parsing POST payloads and GET query parameters (`youtube/playlist`, `youtube/playlist/items`, `youtube/search`) lacked length constraints and explicit type checking. Attackers could theoretically send excessively long strings or incorrect types, leading to backend parsing issues, API errors with external services, or resource exhaustion.
**Learning:** Always validate both the type and maximum length of string parameters when parsing user input from `request.json()` or query parameters before processing them or forwarding them to external APIs. Unbounded input sizes open vectors for DoS and trigger poorly handled edge cases in third-party services.
**Prevention:** Implement strict explicit validations (e.g., `typeof val === 'string'`, `.length < MAX`, regex patterns) directly at the beginning of API route handlers.
## 2024-05-18 - [Fix modulo bias in PRNG]
**Vulnerability:** The `generateRandomString` function used for cryptographic strings (PKCE code_verifier, OAuth state) had a modulo bias vulnerability. It used `x % possible.length` to pick characters, causing a non-uniform distribution of characters because 256 is not evenly divisible by 66.
**Learning:** Even when using a secure random number generator like `crypto.getRandomValues()`, mapping those values to a character set using simple modulo arithmetic introduces a bias, weakening the randomness.
**Prevention:** Always use rejection sampling when mapping uniformly distributed random values to an arbitrary length character set that is not a power of 2 factor of the random value space.
## 2025-02-27 - [Security] Prevent CSRF via OAuth State Leakage
**Vulnerability:** The application was only deleting the `spotify_auth_state`, `google_auth_state`, and their corresponding `code_verifier` cookies upon a successful token exchange. If an error occurred (e.g., user cancellation, invalid state, server error), these single-use cookies were left active in the user's browser until their expiration time.
**Learning:** Failing to invalidate temporary OAuth state and PKCE verifiers on error paths leaves a prolonged window for Cross-Site Request Forgery (CSRF) or state fixation attacks, where a stale state could potentially be reused.
**Prevention:** Always implement cookie cleanup for temporary OAuth state parameters in *all* return paths (including early error returns and `catch` blocks) within the callback handler to ensure they are strictly single-use.

## 2025-02-27 - [Security] Prevent Parameter Injection in OAuth Callbacks
**Vulnerability:** The OAuth callback routes (`src/app/api/auth/callback/spotify/route.ts` and `src/app/api/auth/callback/google/route.ts`) were constructing redirect URLs using string concatenation (e.g., `new URL('/?error=' + error, request.url)`).
**Learning:** If the `error` string returned by the OAuth provider (or manipulated by an attacker) contains unescaped special characters like `&` or `#`, it could lead to parameter injection or Cross-Site Scripting (XSS).
**Prevention:** Always use the `URL` object and `URLSearchParams.set()` method to construct URLs with query parameters. This ensures that parameter values are safely URL-encoded and prevents injection vulnerabilities.

## 2025-02-27 - [Security] Prevent Unbounded Pagination and Resource Exhaustion
**Vulnerability:** The backend endpoints that fetched paginated data from Spotify and YouTube (`src/app/api/spotify/playlist/route.ts` and `src/app/api/youtube/playlist/route.ts`) were using unbounded `while (url)` and `do { ... } while (nextPageToken)` loops. An attacker could potentially provide a playlist ID containing an abnormally large number of items, causing the server to fetch indefinitely until out of memory or exhausting the external API rate limit, leading to Denial of Service (DoS).
**Learning:** External API responses and their pagination tokens should never be trusted as the sole terminator for an unbound loop. A hard limit is required to protect the server's own resources.
**Prevention:** Always enforce a hard iteration limit (e.g., `const MAX_PAGES = 50; let pageCount = 0;`) when executing sequential requests to fetch paginated data.
