import { NextRequest, NextResponse } from 'next/server';
import { exchangeGoogleCodeForToken } from '@/utils/oauth';
import { getEnv } from '@/utils/env';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const cookieStore = request.cookies;
  const storedState = cookieStore.get('google_auth_state')?.value;
  const codeVerifier = cookieStore.get('google_code_verifier')?.value;

  if (error) {
    const errorUrl = new URL('/', request.url);
    errorUrl.searchParams.set('error', error);
    return NextResponse.redirect(errorUrl);
  }

  if (!code || !state || state !== storedState || !codeVerifier) {
    const errorUrl = new URL('/', request.url);
    errorUrl.searchParams.set('error', 'invalid_auth_session');
    return NextResponse.redirect(errorUrl);
  }

  try {
    const clientId = getEnv('GOOGLE_CLIENT_ID');
    const clientSecret = getEnv('GOOGLE_CLIENT_SECRET');
    const redirectUri = getEnv('GOOGLE_REDIRECT_URI', 'http://localhost:3000/api/auth/callback/google');

    const data = await exchangeGoogleCodeForToken(clientId, clientSecret, code, redirectUri, codeVerifier);

    if (data.access_token) {
      const response = NextResponse.redirect(new URL('/', request.url));


      const expiresAt = Date.now() + (data.expires_in * 1000);
      response.cookies.set('google_access_token', data.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: data.expires_in,
        path: '/',
      });
      response.cookies.set('google_expires_at', expiresAt.toString(), {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: data.expires_in,
        path: '/',
      });


      if (data.refresh_token) {
        response.cookies.set('google_refresh_token', data.refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 10 * 365 * 24 * 60 * 60,
          path: '/',
        });
      }

      response.cookies.delete('google_auth_state');
      response.cookies.delete('google_code_verifier');

      return response;
    } else {
      const errorUrl = new URL('/', request.url);
      errorUrl.searchParams.set('error', 'token_exchange_failed');
      return NextResponse.redirect(errorUrl);
    }
  } catch (err) {
    console.error('Google token exchange error:', err);
    const errorUrl = new URL('/', request.url);
    errorUrl.searchParams.set('error', 'server_error');
    return NextResponse.redirect(errorUrl);
  }
}
