import { NextRequest, NextResponse } from 'next/server';
import { exchangeSpotifyCodeForToken } from '@/utils/oauth';
import { getEnv } from '@/utils/env';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const cookieStore = request.cookies;
  const storedState = cookieStore.get('spotify_auth_state')?.value;
  const codeVerifier = cookieStore.get('spotify_code_verifier')?.value;

  const clearStateCookies = (response: NextResponse) => {
    response.cookies.delete('spotify_auth_state');
    response.cookies.delete('spotify_code_verifier');
    return response;
  };

  if (error) {
    return clearStateCookies(NextResponse.redirect(new URL('/?error=' + error, request.url)));
  }

  if (!code || !state || state !== storedState || !codeVerifier) {
    return clearStateCookies(NextResponse.redirect(new URL('/?error=invalid_auth_session', request.url)));
  }

  try {
    const clientId = getEnv('SPOTIFY_CLIENT_ID');
    const clientSecret = getEnv('SPOTIFY_CLIENT_SECRET');
    const redirectUri = getEnv('SPOTIFY_REDIRECT_URI', 'http://127.0.0.1:3000/api/auth/callback/spotify');

    const data = await exchangeSpotifyCodeForToken(clientId, clientSecret, code, redirectUri, codeVerifier);

    if (data.access_token) {
      const response = NextResponse.redirect(new URL('/', request.url));

      const expiresAt = Date.now() + (data.expires_in * 1000);
      response.cookies.set('spotify_access_token', data.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: data.expires_in,
        path: '/',
      });
      response.cookies.set('spotify_expires_at', expiresAt.toString(), {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: data.expires_in,
        path: '/',
      });

      if (data.refresh_token) {
        response.cookies.set('spotify_refresh_token', data.refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        });
      }

      return clearStateCookies(response);
    } else {
      return clearStateCookies(NextResponse.redirect(new URL('/?error=token_exchange_failed', request.url)));
    }
  } catch (err) {
    console.error('Spotify token exchange error:', err);
    return clearStateCookies(NextResponse.redirect(new URL('/?error=server_error', request.url)));
  }
}
