import { NextRequest, NextResponse } from 'next/server';
import { getSpotifyToken } from '@/lib/backend-auth';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const playlistId = request.nextUrl.searchParams.get('playlistId');
  if (!playlistId) return NextResponse.json({ error: 'Missing playlistId' }, { status: 400 });

  const { token, refreshed, newData } = await getSpotifyToken();
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    let url: string | null = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    let allItems: any[] = [];
    while (url) {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      allItems = allItems.concat(response.data.items);
      url = response.data.next;
    }
    const tracks = allItems.map(item => ({
      title: item.track?.name || 'Unknown',
      artist: item.track?.artists?.map((a: any) => a.name).join(', ') || 'Unknown',
      album: item.track?.album?.name || 'Unknown',
      platformId: item.track?.id || '',
    }));
    const response = NextResponse.json(tracks);
    if (refreshed && newData) {
      response.cookies.set('spotify_access_token', newData.access_token, {
        httpOnly: true, secure: true, sameSite: 'strict', maxAge: newData.expires_in, path: '/',
      });
    }
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.response?.status || 500 });
  }
}
