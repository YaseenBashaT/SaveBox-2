export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoCount: number;
}

export interface RedditPost {
  id: string;
  title: string;
  subreddit: string;
  permalink: string;
  created: number;
  score: number;
}

export interface TwitterPost {
  id: string;
  text: string;
  authorUsername: string;
  created: string;
  likes: number;
}