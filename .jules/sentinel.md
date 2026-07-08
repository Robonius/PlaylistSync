## 2025-02-14 - Fix TypeScript Type Safety in Error Handling
**Vulnerability:** Code in `src/app/IndexContent.tsx` accessed `error.message` directly in catch blocks, despite `error` being typed as `unknown`. Because `next.config.ts` had `ignoreBuildErrors: true` for typescript, these errors were silently ignored.
**Learning:** Developers must manually verify type safety for `unknown` errors, especially when bypassing build-time compiler checks.
**Prevention:** Use standard `error instanceof Error ? error.message : 'Unknown error'` checks to handle non-standard thrown objects safely without casting.

## 2025-02-14 - Fix Next.js Header Source Pattern
**Vulnerability:** When applying security headers in `next.config.ts`, the source path was configured as `/(.*)`. Next.js does not allow unnamed regex capture groups in path matching, causing a fatal build error.
**Learning:** Next.js uses a custom path-to-regexp implementation. Standard regular expressions often break the build.
**Prevention:** Always use Next.js specific path matchers like `/:path*` for catch-all routes in `next.config.ts` headers, rewrites, and redirects.
