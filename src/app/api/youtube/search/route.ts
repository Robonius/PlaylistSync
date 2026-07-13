import { NextRequest, NextResponse } from 'next/server';
import { getGoogleToken } from '@/lib/backend-auth';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');
  if (!q) return NextResponse.json({ error: 'Missing query' }, { status: 400 });

  if (q.length > 200) {
    return NextResponse.json({ error: 'Query too long' }, { status: 400 });
  }

  const { token, refreshed, newData, clearCookies } = await getGoogleToken();

  if (clearCookies) {
    const response = NextResponse.json({ error: 'Session expired' }, { status: 401 });
    response.cookies.delete('google_access_token');
    response.cookies.delete('google_refresh_token');
    response.cookies.delete('google_expires_at');
    return response;
  }

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });


  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: { part: 'snippet', q, type: 'video', videoCategoryId: '10', maxResults: 1 },
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000
    });
    const items = response.data.items;
    const videoId = items.length > 0 ? items[0].id.videoId : null;
    const nextResponse = NextResponse.json({ videoId });

    if (refreshed && newData) {
      const expiresAt = Date.now() + (newData.expires_in * 1000);
      nextResponse.cookies.set('google_access_token', newData.access_token, {
        httpOnly: true, secure: true, sameSite: 'strict', maxAge: newData.expires_in, path: '/',
      });
      nextResponse.cookies.set('google_expires_at', expiresAt.toString(), {
        httpOnly: true, secure: true, sameSite: 'strict', maxAge: newData.expires_in, path: '/',
      });
      if (newData.refresh_token) {
        nextResponse.cookies.set('google_refresh_token', newData.refresh_token, {
          httpOnly: true, secure: true, sameSite: 'strict', maxAge: 10 * 365 * 24 * 60 * 60, path: '/',
        });
      }
    }
    return nextResponse;
  } catch (error: unknown) {
    const status = axios.isAxiosError(error) ? error.response?.status || 500 : 500;
    const response = NextResponse.json({ error: 'Error searching YouTube track' }, { status });
    if (status === 401) {
      response.cookies.delete('google_access_token');
      response.cookies.delete('google_refresh_token');
    }
    return response;
  }
}
