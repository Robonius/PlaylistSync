import { NextRequest, NextResponse } from 'next/server';
import { getGoogleToken } from '@/lib/backend-auth';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');
  if (!q) return NextResponse.json({ error: 'Missing query' }, { status: 400 });

  const { token, refreshed, newData } = await getGoogleToken();
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: { part: 'snippet', q, type: 'video', videoCategoryId: '10', maxResults: 1 },
      headers: { Authorization: `Bearer ${token}` }
    });
    const items = response.data.items;
    const videoId = items.length > 0 ? items[0].id.videoId : null;
    const nextResponse = NextResponse.json({ videoId });
    if (refreshed && newData) {
      nextResponse.cookies.set('google_access_token', newData.access_token, {
        httpOnly: true, secure: true, sameSite: 'strict', maxAge: newData.expires_in, path: '/',
      });
    }
    return nextResponse;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.response?.status || 500 });
  }
}
