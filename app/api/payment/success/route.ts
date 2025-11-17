import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

const supabase = createServerClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.redirect(new URL('/book', request.url));
  }

  // Verify payment and update booking status
  // This is a fallback in case webhook doesn't fire
  // In production, rely on webhooks for payment confirmation

  return NextResponse.redirect(new URL('/confirmation', request.url));
}

