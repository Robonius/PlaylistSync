import { getEnv } from './env';

const SPOTIFY_CLIENT_ID = getEnv('SPOTIFY_CLIENT_ID');
const GOOGLE_CLIENT_ID = getEnv('GOOGLE_CLIENT_ID');
const REDIRECT_URI = getEnv('OAUTH_REDIRECT_URI', 'http://localhost:8080/callback');

export type AuthProvider = 'spotify' | 'google';

interface AuthState {
  codeVerifier: string;
  provider: AuthProvider;
}

const generateRandomString = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest('SHA-256', data);
};

const base64encode = (input: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

export const initiateOAuth = async (provider: AuthProvider) => {
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  localStorage.setItem('auth_state', JSON.stringify({ codeVerifier, provider }));

  let authUrl = '';
  if (provider === 'spotify') {
    const scope = 'playlist-read-private playlist-modify-public playlist-modify-private';
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: REDIRECT_URI,
    });
    authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  } else if (provider === 'google') {
    const scope = 'https://www.googleapis.com/auth/youtube';
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      access_type: 'offline',
      prompt: 'consent',
    });
    authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  window.location.href = authUrl;
};

export const handleCallback = async (code: string) => {
  const savedState = localStorage.getItem('auth_state');
  if (!savedState) throw new Error('No auth state found');

  const { codeVerifier, provider } = JSON.parse(savedState) as AuthState;

  const tokenUrl = provider === 'spotify'
    ? 'https://accounts.spotify.com/api/token'
    : 'https://oauth2.googleapis.com/token';

  const body = provider === 'spotify'
    ? new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      })
    : new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error_description || data.error);

  localStorage.setItem(`${provider}_access_token`, data.access_token);
  if (data.refresh_token) {
    localStorage.setItem(`${provider}_refresh_token`, data.refresh_token);
  }

  localStorage.removeItem('auth_state');

  return provider;
};

export const getAccessToken = (provider: AuthProvider) => {
  return localStorage.getItem(`${provider}_access_token`);
};

export const logout = (provider: AuthProvider) => {
  localStorage.removeItem(`${provider}_access_token`);
  localStorage.removeItem(`${provider}_refresh_token`);
};
