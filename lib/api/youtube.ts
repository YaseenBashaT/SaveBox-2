import { YouTubePlaylist } from '@/lib/types/social';

export async function fetchYouTubePlaylist(playlistId: string): Promise<YouTubePlaylist> {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch YouTube playlist');
  }

  const data = await response.json();
  const playlist = data.items[0];

  return {
    id: playlist.id,
    title: playlist.snippet.title,
    description: playlist.snippet.description,
    thumbnailUrl: playlist.snippet.thumbnails.medium.url,
    videoCount: playlist.contentDetails.itemCount,
  };
}