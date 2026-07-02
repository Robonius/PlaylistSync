/**
 * Utility to get environment variables.
 * Note: Client-side usage of process.env is only safe for variables prefixed with NEXT_PUBLIC_
 * OR when passed from the server via a Provider.
 * This utility will eventually be replaced by the RuntimeConfigProvider for client-side use.
 */

/**
 * Gets an environment variable by key.
 * This is primarily for server-side use or build-time NEXT_PUBLIC_ variables.
 */
export const getEnv = (key: string, defaultValue: string = ''): string => {
  const envValue = process.env[key];
  if (envValue) {
    return envValue;
  }

  return defaultValue;
};
