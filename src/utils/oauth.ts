/**
 * OAuth 2.0 PKCE Helpers for Spotify and Google
 */

const generateRandomString = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values)
    .map((x) => possible[x % possible.length])
    .join('');
};

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
};

const base64urlencode = (a: ArrayBuffer) => {
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(a))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const generateCodeChallenge = async (codeVerifier: string) => {
  const hashed = await sha256(codeVerifier);
  return base64urlencode(hashed);
};

export const initiateSpotifyAuth = async (clientId: string, redirectUri: string) => {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateRandomString(32);

  // Use document.cookie for PKCE state so backend can read it
  document.cookie = "spotify_code_verifier=" + codeVerifier + "; path=/; max-age=3600; SameSite=Lax; Secure";
  document.cookie = "spotify_auth_state=" + state + "; path=/; max-age=3600; SameSite=Lax; Secure";

  const scope = 'playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private';
  const authUrl = new URL('https://accounts.spotify.com/authorize');

  const params = {
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
    state,
  };

  const searchParams = new URLSearchParams(params);
  authUrl.search = searchParams.toString();
  window.location.href = authUrl.toString();
};

export const initiateGoogleAuth = async (clientId: string, redirectUri: string) => {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateRandomString(32);

  document.cookie = "google_code_verifier=" + codeVerifier + "; path=/; max-age=3600; SameSite=Lax; Secure";
  document.cookie = "google_auth_state=" + state + "; path=/; max-age=3600; SameSite=Lax; Secure";

  const scope = 'https://www.googleapis.com/auth/youtube';
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

  const params = {
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    access_type: 'offline',
    prompt: 'consent',
    state,
  };

  const searchParams = new URLSearchParams(params);
  authUrl.search = searchParams.toString();
  window.location.href = authUrl.toString();
};

export const exchangeSpotifyCodeForToken = async (clientId: string, clientSecret: string, code: string, redirectUri: string, codeVerifier: string) => {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  const authHeader = btoa(clientId + ":" + clientSecret);

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + authHeader
    },
    body: params,
  });

  return response.json();
};

export const exchangeGoogleCodeForToken = async (clientId: string, clientSecret: string, code: string, redirectUri: string, codeVerifier: string) => {
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
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

export const refreshSpotifyToken = async (clientId: string, clientSecret: string, refreshToken: string) => {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const authHeader = btoa(clientId + ":" + clientSecret);

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + authHeader
    },
    body: params,
  });

  return response.json();
};

export const refreshGoogleToken = async (clientId: string, clientSecret: string, refreshToken: string) => {
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
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
