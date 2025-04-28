import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (session && session.name) {
    return NextResponse.json({ name: session.name });
  }
  return NextResponse.json({ name: null });
} 