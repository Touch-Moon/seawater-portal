import { NextRequest, NextResponse } from 'next/server'
import { fetchNowPlaying } from '@/lib/radio'

export async function GET(req: NextRequest) {
  const channelId = req.nextUrl.searchParams.get('channel') || 'am1250'
  const data = await fetchNowPlaying(channelId)
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'no-cache, no-store' },
  })
}
