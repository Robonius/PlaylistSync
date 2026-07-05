import { NextRequest, NextResponse } from 'next/server';
import { getGoogleToken } from '@/lib/backend-auth';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const playlistId = request.nextUrl.searchParams.get('playlistId');
  if (!playlistId) return NextResponse.json({ error: 'Missing playlistId' }, { status: 400 });

  // Security: Validate playlistId format
  if (!/^[a-zA-Z0-9_-]+$/.test(playlistId)) {
    return NextResponse.json({ error: 'Invalid playlistId format' }, { status: 400 });
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
    let allItems: Record<string, unknown>[] = [];
    let nextPageToken = '';
    do {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
        params: { part: 'snippet,contentDetails', maxResults: 50, playlistId: playlistId, pageToken: nextPageToken },
        headers: { Authorization: `Bearer ${token}` }
      });
      allItems = allItems.concat(response.data.items);
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);
    const tracks = allItems.map(item => ({
      title: (item.snippet as Record<string, any>)?.title || 'Unknown',
      artist: (item.snippet as Record<string, any>)?.videoOwnerChannelTitle || 'Unknown',
      album: 'YouTube Video',
      platformId: (item.contentDetails as Record<string, any>)?.videoId || '',
    }));
    const response = NextResponse.json(tracks);

    if (refreshed && newData) {
      const expiresAt = Date.now() + (newData.expires_in * 1000);
      response.cookies.set('google_access_token', newData.access_token, {
        httpOnly: true, secure: true, sameSite: 'strict', maxAge: newData.expires_in, path: '/',
      });
      response.cookies.set('google_expires_at', expiresAt.toString(), {
        httpOnly: true, secure: true, sameSite: 'strict', maxAge: newData.expires_in, path: '/',
      });
      if (newData.refresh_token) {
        response.cookies.set('google_refresh_token', newData.refresh_token, {
          httpOnly: true, secure: true, sameSite: 'strict', maxAge: 10 * 365 * 24 * 60 * 60, path: '/',
        });
      }
    }
    return response;
  } catch (error: unknown) {
    const status = axios.isAxiosError(error) ? error.response?.status || 500 : 500;
    const response = NextResponse.json({ error: 'Error fetching YouTube playlist' }, { status });
    if (status === 401) {
      response.cookies.delete('google_access_token');
      response.cookies.delete('google_refresh_token');
    }
    return response;
  }
}

export async function POST(request: NextRequest) {
  const { title, description } = await request.json();

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
    const response = await axios.post(`https://www.googleapis.com/youtube/v3/playlists`, {
      snippet: { title: title, description: description || 'Imported by RoboLab // Sync' },
      status: { privacyStatus: 'private' }
    }, {
      params: { part: 'snippet,status' },
      headers: { Authorization: `Bearer ${token}` },
    });
    const nextResponse = NextResponse.json({ playlistId: response.data.id });

    if (refreshed && newData) {
      const expiresAt = Date.now() + (newData.expires_in * 1000);
      response.cookies.set('google_access_token', newData.access_token, {
        httpOnly: true, secure: true, sameSite: 'strict', maxAge: newData.expires_in, path: '/',
      });
      response.cookies.set('google_expires_at', expiresAt.toString(), {
        httpOnly: true, secure: true, sameSite: 'strict', maxAge: newData.expires_in, path: '/',
      });
      if (newData.refresh_token) {
        response.cookies.set('google_refresh_token', newData.refresh_token, {
          httpOnly: true, secure: true, sameSite: 'strict', maxAge: 10 * 365 * 24 * 60 * 60, path: '/',
        });
      }
    }
    return nextResponse;
  } catch (error: unknown) {
    const status = axios.isAxiosError(error) ? error.response?.status || 500 : 500;
    const response = NextResponse.json({ error: 'Error creating YouTube playlist' }, { status });
    if (status === 401) {
      response.cookies.delete('google_access_token');
      response.cookies.delete('google_refresh_token');
    }
    return response;
  }
}
