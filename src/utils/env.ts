export const getEnv = (key: string, defaultValue: string = ''): string => {
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[key] || process.env[`NEXT_PUBLIC_${key}`];
    if (value) return value;
  }
  return defaultValue;
};
