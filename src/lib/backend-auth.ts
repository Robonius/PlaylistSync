import { cookies } from 'next/headers';
import { refreshSpotifyToken, refreshGoogleToken } from '@/utils/oauth';
import { getEnv } from '@/utils/env';

export async function getSpotifyToken() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_access_token')?.value;
  const refreshToken = cookieStore.get('spotify_refresh_token')?.value;
  const expiresAt = cookieStore.get('spotify_expires_at')?.value;

  const now = Date.now();
  const isExpired = expiresAt ? now > (parseInt(expiresAt) - 300000) : true; // 5 minute buffer

  if (refreshToken && (!accessToken || isExpired)) {
    try {
      const clientId = getEnv('SPOTIFY_CLIENT_ID');
      const clientSecret = getEnv('SPOTIFY_CLIENT_SECRET');
      const data = await refreshSpotifyToken(clientId, clientSecret, refreshToken);

      if (data.access_token) {
        return { token: data.access_token, refreshed: true, newData: data, clearCookies: false };
      }
    } catch (err) {
      console.error('Failed to refresh Spotify token', err);
      return { token: null, refreshed: false, clearCookies: true };
    }
  }
  return { token: accessToken, refreshed: false, clearCookies: false };
}

export async function getGoogleToken() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('google_access_token')?.value;
  const refreshToken = cookieStore.get('google_refresh_token')?.value;
  const expiresAt = cookieStore.get('google_expires_at')?.value;

  const now = Date.now();
  const isExpired = expiresAt ? now > (parseInt(expiresAt) - 300000) : true; // 5 minute buffer

  // Caveat: only refresh if we HAVE a refresh token
  if (refreshToken && (!accessToken || isExpired)) {
    try {
      const clientId = getEnv('GOOGLE_CLIENT_ID');
      const clientSecret = getEnv('GOOGLE_CLIENT_SECRET');
      const data = await refreshGoogleToken(clientId, clientSecret, refreshToken);

      if (data.access_token) {
        return { token: data.access_token, refreshed: true, newData: data, clearCookies: false };
      }
    } catch (err) {
      console.error('Failed to refresh Google token', err);
      return { token: null, refreshed: false, clearCookies: true };
    }
  }
  return { token: accessToken, refreshed: false, clearCookies: false };
}
