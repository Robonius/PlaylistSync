## 2025-05-18 - Axios Error Object Leakage
**Vulnerability:** Raw Axios error objects (`error`) were being logged to `console.error()`.
**Learning:** In Axios, the `error` object includes the request `config`, which contains the HTTP headers sent with the request (including `Authorization: Bearer <token>`). Logging the full error object inadvertently leaks sensitive tokens/API keys into the browser console or application logs.
**Prevention:** Never log the raw `error` object or `error.config` when making authenticated requests. Always sanitize the log by logging specific safe properties (e.g., `error.message`) or by avoiding logging the full error object directly. User-facing errors should also be sanitized instead of directly exposing API response details.
