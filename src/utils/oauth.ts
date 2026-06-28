/**
 * OAuth 2.0 PKCE Helpers for Spotify and Google
 */

/**
 * Generates a random string for the code verifier
 */
const generateRandomString = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values)
    .map((x) => possible[x % possible.length])
    .join('');
};

/**
 * Hashes the code verifier using SHA-256
 */
const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
};

/**
 * Base64url encodes an array buffer
 */
const base64urlencode = (a: ArrayBuffer) => {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(a) as any))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

/**
 * Generates a code challenge from a code verifier
 */
export const generateCodeChallenge = async (codeVerifier: string) => {
  const hashed = await sha256(codeVerifier);
  return base64urlencode(hashed);
};

export const initiateSpotifyAuth = async (clientId: string, redirectUri: string) => {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem('spotify_code_verifier', codeVerifier);

  const scope = 'playlist-read-private playlist-modify-public playlist-modify-private';
  const authUrl = new URL('https://accounts.spotify.com/authorize');

  const params = {
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
};

export const initiateGoogleAuth = async (clientId: string, redirectUri: string) => {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem('google_code_verifier', codeVerifier);

  // Scopes for YouTube write access
  const scope = 'https://www.googleapis.com/auth/youtube';
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

  const params = {
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    access_type: 'offline', // Note: For Web apps with PKCE, refresh tokens might be limited
    prompt: 'consent'
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
};

export const exchangeSpotifyCodeForToken = async (clientId: string, code: string, redirectUri: string) => {
  const codeVerifier = localStorage.getItem('spotify_code_verifier');

  const params = new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier || '',
  });

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  return response.json();
};

export const exchangeGoogleCodeForToken = async (clientId: string, code: string, redirectUri: string) => {
  const codeVerifier = localStorage.getItem('google_code_verifier');

  const params = new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier || '',
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  return response.json();
};
