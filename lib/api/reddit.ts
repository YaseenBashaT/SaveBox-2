import { RedditPost } from '@/lib/types/social';

export async function fetchRedditPost(postUrl: string): Promise<RedditPost> {
  const postId = extractRedditPostId(postUrl);
  const response = await fetch(
    `https://www.reddit.com/api/info.json?id=t3_${postId}`,
    {
      headers: {
        'User-Agent': 'SaveBox/1.0.0',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Reddit post');
  }

  const data = await response.json();
  const post = data.data.children[0].data;

  return {
    id: post.id,
    title: post.title,
    subreddit: post.subreddit,
    permalink: post.permalink,
    created: post.created_utc,
    score: post.score,
  };
}

function extractRedditPostId(url: string): string {
  const match = url.match(/comments\/([a-zA-Z0-9]+)/);
  if (!match) throw new Error('Invalid Reddit post URL');
  return match[1];
}