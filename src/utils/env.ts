/**
 * Utility to get environment variables.
 * Prioritizes runtime variables from window._env_ (injected by Docker entrypoint)
 * falling back to build-time import.meta.env (Vite standard, now using ROBOLAB_ prefix).
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

  // 2. Check build-time environment (import.meta.env)
  // Vite is now configured to expose variables prefixed with ROBOLAB_
  const envValue = (import.meta.env as any)[normalizedKey];
  if (envValue) {
    return envValue;
  }

  return defaultValue;
};
