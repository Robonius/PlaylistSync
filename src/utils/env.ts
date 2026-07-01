/**
 * Utility to get environment variables.
 * Prioritizes runtime variables from window._env_ (injected by Docker entrypoint)
 * falling back to build-time environment variables (Next.js standard, now using ROBOLAB_ prefix).
 */

declare global {
  interface Window {
    _env_?: Record<string, string>;
  }
}

/**
 * Gets an environment variable by key.
 *
 * If the key is sensitive, it should be provided at runtime via Docker or a local .env file.
 * We use the ROBOLAB_ prefix for all environment variables.
 */
export const getEnv = (key: string, defaultValue: string = ''): string => {
  // Ensure the key has the ROBOLAB_ prefix if it doesn't already
  const normalizedKey = key.startsWith('ROBOLAB_') ? key : `ROBOLAB_${key}`;

  // 1. Check runtime environment (window._env_) - highest priority
  if (typeof window !== 'undefined' && window._env_ && window._env_[normalizedKey]) {
    return window._env_[normalizedKey];
  }

  // 2. Check build-time environment
  // Next.js exposes environment variables to the browser if they are prefixed with NEXT_PUBLIC_
  // but since we use ROBOLAB_ prefix, we check process.env which works in SSR and
  // we ensure they are handled correctly in client side.
  const envValue = process.env[normalizedKey];
  if (envValue) {
    return envValue;
  }

  return defaultValue;
};
