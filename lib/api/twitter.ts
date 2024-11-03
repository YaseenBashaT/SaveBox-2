import { TwitterPost } from '@/lib/types/social';

export async function fetchTwitterPost(tweetUrl: string): Promise<TwitterPost> {
  const tweetId = extractTweetId(tweetUrl);
  const response = await fetch(
    `https://api.twitter.com/2/tweets/${tweetId}?expansions=author_id&user.fields=username`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TWITTER_BEARER_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Twitter post');
  }

  const data = await response.json();

  return {
    id: data.data.id,
    text: data.data.text,
    authorUsername: data.includes.users[0].username,
    created: data.data.created_at,
    likes: data.data.public_metrics?.like_count || 0,
  };
}

function extractTweetId(url: string): string {
  const match = url.match(/status\/(\d+)/);
  if (!match) throw new Error('Invalid Twitter post URL');
  return match[1];
}