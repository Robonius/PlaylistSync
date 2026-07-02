import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const cookieStore = request.cookies;

  return NextResponse.json({
    spotify: !!cookieStore.get('spotify_access_token')?.value,
    youtube: !!cookieStore.get('google_access_token')?.value,
  });
}
