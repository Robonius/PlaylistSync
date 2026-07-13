import { NextRequest, NextResponse } from 'next/server';
import { getGoogleToken } from '@/lib/backend-auth';
import axios from 'axios';

export async function POST(request: NextRequest) {
  let playlistId: string;
  let videoId: string;

  try {
    const body = await request.json();
    playlistId = body.playlistId;
    videoId = body.videoId;
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  // Security: Validate playlistId and videoId format
  if (!playlistId || typeof playlistId !== 'string' || !/^[a-zA-Z0-9_-]{10,40}$/.test(playlistId)) {
    return NextResponse.json({ error: 'Invalid playlistId format' }, { status: 400 });
  }

  if (!videoId || typeof videoId !== 'string' || !/^[a-zA-Z0-9_-]{10,20}$/.test(videoId)) {
    return NextResponse.json({ error: 'Invalid videoId format' }, { status: 400 });
  }

  const { token, refreshed, newData } = await getGoogleToken();
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await axios.post(`https://www.googleapis.com/youtube/v3/playlistItems`, {
      snippet: { playlistId: playlistId, resourceId: { kind: 'youtube#video', videoId: videoId } }
    }, {
      params: { part: 'snippet' },
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
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
