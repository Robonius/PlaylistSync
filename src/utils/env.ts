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

export const getEnv = (key: string, defaultValue: string = ''): string => {
  if (typeof window !== 'undefined' && window._env_ && window._env_[key]) {
    return window._env_[key];
  }

  // Vite handles import.meta.env mapping at build time
  // We use a type cast to any to avoid TS issues with dynamic access
  const viteEnv = (import.meta.env as any)[key];
  return viteEnv || defaultValue;
};
