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
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID}:${process.env.NEXT_PUBLIC_TWITTER_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI!,
        code_verifier: 'challenge',
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
        twitter: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: Date.now() + tokens.expires_in * 1000,
        },
      }, { merge: true });
    }

    return NextResponse.redirect('/dashboard?success=twitter_connected');
  } catch (error) {
    console.error('Twitter OAuth error:', error);
    return NextResponse.redirect('/dashboard?error=auth_failed');
  }
}