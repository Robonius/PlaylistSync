import { NextRequest, NextResponse } from 'next/server';
import { getYouTubePlaylistServer } from '@/utils/api-server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const playlistId = searchParams.get('playlistId');
  const apiKey = searchParams.get('apiKey') || '';

  if (!playlistId) {
    return NextResponse.json({ error: 'Playlist ID is required' }, { status: 400 });
  }

  try {
    const data = await getYouTubePlaylistServer(playlistId, apiKey);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
}
