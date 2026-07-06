import { NextRequest, NextResponse } from 'next/server';
import { getGoogleToken } from '@/lib/backend-auth';
import axios from 'axios';

export async function POST(request: NextRequest) {
  const { playlistId, videoId } = await request.json();
  const { token, refreshed, newData } = await getGoogleToken();
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await axios.post(`https://www.googleapis.com/youtube/v3/playlistItems`, {
      snippet: { playlistId: playlistId, resourceId: { kind: 'youtube#video', videoId: videoId } }
    }, {
      params: { part: 'snippet' },
      headers: { Authorization: `Bearer ${token}` },
    });
    const nextResponse = NextResponse.json({ success: true });
    if (refreshed && newData) {
      nextResponse.cookies.set('google_access_token', newData.access_token, {
        httpOnly: true, secure: true, sameSite: 'strict', maxAge: newData.expires_in, path: '/',
      });
    }
    return nextResponse;
  } catch (error: unknown) {
    const status = axios.isAxiosError(error) ? error.response?.status || 500 : 500;
    const response = NextResponse.json({ error: 'Error adding items to YouTube playlist' }, { status });
    if (status === 401) {
      response.cookies.delete('google_access_token');
      response.cookies.delete('google_refresh_token');
    }
    return response;
  }
}
