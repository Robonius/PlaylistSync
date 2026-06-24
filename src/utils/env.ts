/**
 * Utility to get environment variables.
 * Prioritizes runtime variables from window._env_ (injected by Docker entrypoint)
 * falling back to build-time import.meta.env (Vite standard).
 */

declare global {
  interface Window {
    _env_?: Record<string, string>;
  }
}

/**
 * Gets an environment variable by key.
 *
 * If the key is sensitive (e.g., SPOTIFY_API_KEY), it should be provided
 * at runtime via Docker or a local .env file. Sensitive keys should NOT
 * be prefixed with VITE_ to prevent them from being baked into the bundle
 * by Vite's build process.
 */
export const getEnv = (key: string, defaultValue: string = ''): string => {
  // 1. Check runtime environment (window._env_)
  if (typeof window !== 'undefined' && window._env_ && window._env_[key]) {
    return window._env_[key];
  }

  // 2. Check build-time environment (import.meta.env)
  // Vite only exposes variables prefixed with VITE_ to the client bundle
  // unless explicitly configured otherwise.
  const viteEnv = (import.meta.env as any)[key];
  if (viteEnv) {
    return viteEnv;
  }

  // 3. Optional: Map non-VITE keys to VITE_ keys for compatibility with local dev .env
  const viteKey = key.startsWith('VITE_') ? key : `VITE_${key}`;
  const mappedViteEnv = (import.meta.env as any)[viteKey];
  if (mappedViteEnv) {
    return mappedViteEnv;
  }

  return defaultValue;
};
