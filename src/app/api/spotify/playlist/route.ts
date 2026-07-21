import { NextRequest, NextResponse } from 'next/server';
import { getSpotifyToken } from '@/lib/backend-auth';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const playlistId = request.nextUrl.searchParams.get('playlistId');
  if (!playlistId) return NextResponse.json({ error: 'Missing playlistId' }, { status: 400 });

  // Security: Validate playlistId format to prevent SSRF / Path Traversal
  if (!/^[a-zA-Z0-9]{22}$/.test(playlistId)) {
    return NextResponse.json({ error: 'Invalid playlistId format' }, { status: 400 });
  }


  const { token, refreshed, newData, clearCookies } = await getSpotifyToken();

  if (clearCookies) {
    const response = NextResponse.json({ error: 'Session expired' }, { status: 401 });
    response.cookies.delete('spotify_access_token');
    response.cookies.delete('spotify_refresh_token');
    response.cookies.delete('spotify_expires_at');
    return response;
  }

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });


  try {
    let url: string | null = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    let allItems: Record<string, unknown>[] = [];
    let pageCount = 0;
    const MAX_PAGES = 50;

    while (url) {
      // Security: Enforce a hard iteration limit to prevent resource exhaustion (DoS)
      if (pageCount >= MAX_PAGES) {
        console.warn(`Security Warning: Max pagination limit (${MAX_PAGES}) reached for Spotify playlist ${playlistId}`);
        break;
      }
      pageCount++;

      // Security: Prevent SSRF and Token Leakage by validating pagination URL
      if (!url.startsWith('https://api.spotify.com/')) {
        console.error('Security Warning: Invalid pagination URL received from Spotify API:', url);
        break;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      allItems = allItems.concat(response.data.items);
      url = response.data.next;
    }
    const tracks = allItems.map(item => ({
      title: (item.track as Record<string, any>)?.name || 'Unknown',
      artist: (item.track as Record<string, any>)?.artists?.map((a: Record<string, unknown>) => a.name).join(', ') || 'Unknown',
      album: (item.track as Record<string, any>)?.album?.name || 'Unknown',
      platformId: (item.track as Record<string, any>)?.id || '',
    }));
    const response = NextResponse.json(tracks);

    if (refreshed && newData) {
      const expiresAt = Date.now() + (newData.expires_in * 1000);
      response.cookies.set('spotify_access_token', newData.access_token, {
        httpOnly: true, secure: true, sameSite: 'strict', maxAge: newData.expires_in, path: '/',
      });
      response.cookies.set('spotify_expires_at', expiresAt.toString(), {
        httpOnly: true, secure: true, sameSite: 'strict', maxAge: newData.expires_in, path: '/',
      });
      if (newData.refresh_token) {
        response.cookies.set('spotify_refresh_token', newData.refresh_token, {
          httpOnly: true, secure: true, sameSite: 'strict', maxAge: 30 * 24 * 60 * 60, path: '/',
        });
      }
    }
    return response;
  } catch (error: unknown) {
    const status = axios.isAxiosError(error) ? error.response?.status || 500 : 500;
    const response = NextResponse.json({ error: 'Error fetching Spotify playlist' }, { status });
    if (status === 401) {
      response.cookies.delete('spotify_access_token');
      response.cookies.delete('spotify_refresh_token');
    }
    return response;
  }
}
