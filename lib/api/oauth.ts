import { auth } from '@/lib/firebase/config';

const YOUTUBE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const REDDIT_AUTH_URL = 'https://www.reddit.com/api/v1/authorize';
const TWITTER_AUTH_URL = 'https://twitter.com/i/oauth2/authorize';

export const initiateYouTubeAuth = () => {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated');
  }

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_YOUTUBE_REDIRECT_URI!,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
    access_type: 'offline',
    prompt: 'consent',
    state: auth.currentUser.uid,
  });

  window.location.href = `${YOUTUBE_AUTH_URL}?${params.toString()}`;
};

export const initiateRedditAuth = () => {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated');
  }

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_REDDIT_REDIRECT_URI!,
    response_type: 'code',
    scope: 'read history identity',
    state: auth.currentUser.uid,
  });

  window.location.href = `${REDDIT_AUTH_URL}?${params.toString()}`;
};

export const initiateTwitterAuth = () => {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated');
  }

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI!,
    response_type: 'code',
    scope: 'tweet.read users.read like.read bookmark.read',
    state: auth.currentUser.uid,
    code_challenge_method: 'S256',
    code_challenge: generateCodeChallenge(),
  });

  window.location.href = `${TWITTER_AUTH_URL}?${params.toString()}`;
};

function generateCodeChallenge(): string {
  const array = new Uint32Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('');
}