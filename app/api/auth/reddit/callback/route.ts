import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { doc, setDoc } from 'firebase/firestore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect('/dashboard?error=auth_failed');
  }

  try {
    const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID}:${process.env.NEXT_PUBLIC_REDDIT_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.NEXT_PUBLIC_REDDIT_REDIRECT_URI!,
      }),
    });

    const tokens = await tokenResponse.json();

    if (tokens.error) {
      throw new Error(tokens.error_description || 'Failed to get access token');
    }

    // Store tokens in Firestore
    const userId = searchParams.get('state');
    if (userId) {
      await setDoc(doc(db, 'oauth_tokens', userId), {
        reddit: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: Date.now() + tokens.expires_in * 1000,
        },
      }, { merge: true });
    }

    return NextResponse.redirect('/dashboard?success=reddit_connected');
  } catch (error) {
    console.error('Reddit OAuth error:', error);
    return NextResponse.redirect('/dashboard?error=auth_failed');
  }
}