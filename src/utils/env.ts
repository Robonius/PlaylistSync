declare global {
  interface Window {
    _env_?: Record<string, string>;
  }
}

export const getEnv = (key: string, defaultValue: string = ''): string => {
  if (typeof window !== 'undefined' && window._env_ && window._env_[key]) {
    return window._env_[key];
  }
  const envValue = (import.meta.env as any)[key];
  return envValue || defaultValue;
};
