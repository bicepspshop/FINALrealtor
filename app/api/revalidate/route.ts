import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

// This route handles revalidation of cache tags for images
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tag, secret } = body;
    
    // Validate the secret to prevent unauthorized revalidations
    const expectedSecret = process.env.REVALIDATION_SECRET;
    if (!expectedSecret || secret !== expectedSecret) {
      return NextResponse.json(
        { revalidated: false, message: 'Invalid secret' },
        { status: 401 }
      );
    }
    
    // Check if tag is provided
    if (!tag) {
      return NextResponse.json(
        { revalidated: false, message: 'Tag is required' },
        { status: 400 }
      );
    }
    
    // Revalidate the tag
    revalidateTag(tag);
    
    return NextResponse.json(
      { revalidated: true, message: `Cache invalidated for tag: ${tag}` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { revalidated: false, message: 'Error revalidating cache' },
      { status: 500 }
    );
  }
}

// This route allows a GET request to manually purge cache (for testing)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tag = searchParams.get('tag');
  const secret = searchParams.get('secret');
  
  // Validate the secret to prevent unauthorized revalidations
  const expectedSecret = process.env.REVALIDATION_SECRET;
  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json(
      { revalidated: false, message: 'Invalid secret' },
      { status: 401 }
    );
  }
  
  // Check if tag is provided
  if (!tag) {
    return NextResponse.json(
      { revalidated: false, message: 'Tag is required' },
      { status: 400 }
    );
  }
  
  try {
    // Revalidate the tag
    revalidateTag(tag);
    
    return NextResponse.json(
      { revalidated: true, message: `Cache invalidated for tag: ${tag}` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { revalidated: false, message: 'Error revalidating cache' },
      { status: 500 }
    );
  }
} 