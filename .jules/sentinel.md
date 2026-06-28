## 2025-02-27 - [Security] Prevent CSV/Formula Injection in Papaparse Exports
**Vulnerability:** The application was using `papaparse` to export user-provided data directly to CSV without sanitizing string values that could be interpreted as formulas.
**Learning:** `papaparse`'s `unparse` function does not automatically sanitize strings that begin with `=`, `+`, `-`, or `@`. When these values are opened in spreadsheet applications (like Excel), they can execute malicious formulas (CSV/Formula Injection). Furthermore, `papaparse` accepts both arrays of objects and arrays of arrays, so any sanitization logic must handle both structures.
**Prevention:** Always implement a sanitization step before passing data to `Papa.unparse`. This sanitization should map over the rows and prepend a single quote (`'`) to any string fields starting with the aforementioned formula trigger characters.

## 2025-02-27 - [Security] Prevent Sensitive Information Leakage in Error Handling
**Vulnerability:** The application was catching raw Axios errors during API requests (e.g. Spotify and YouTube APIs) and throwing them directly up the chain to the UI. Axios error objects include the full `config` object which contains sensitive properties such as `Authorization` headers (e.g., Bearer tokens).
**Learning:** If an unexpected failure occurs and the raw Axios error is caught and propagated to the frontend or inadvertently logged to a service, it exposes sensitive tokens (like OAuth tokens or API keys) embedded within the request configuration.
**Prevention:** Implement an error sanitization utility (`sanitizeError`) that intercepts errors before they propagate. This utility strips out sensitive configuration properties from Axios errors, retaining only safe data (`message`, `status`, `data`, etc.) required for user feedback and non-sensitive debugging. Use this utility uniformly across all API request handlers.

## 2024-05-20 - [Security] Unified Runtime Environment Variable System
**Vulnerability:** standard Vite build processes "bake" environment variables starting with `VITE_` into the JavaScript bundle. This makes it impossible to change configuration (like Client IDs or Redirect URIs) after the Docker image is built without rebuilding the image, or worse, risks baking production secrets into a public image.
**Learning:** By decoupling configuration from the build artifact, we can maintain a single Docker image that works across development, staging, and production.
**Prevention:**
1. Use a runtime injection script (`docker/entrypoint.sh`) to generate a `window._env_` object from the container's environment variables.
2. Load this script in `index.html` before the main application bundle.
3. Configure `vite.config.ts` with a custom `envPrefix` to allow non-VITE prefixed variables to be accessible (while maintaining security).
4. Use a utility (`src/utils/env.ts`) that prioritizes `window._env_` values over build-time `import.meta.env` values.
5. Standardize on clean environment variable names (e.g., `SPOTIFY_CLIENT_ID` instead of `VITE_SPOTIFY_CLIENT_ID`) for better readability and industrial standards.
