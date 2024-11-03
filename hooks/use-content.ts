"use client";

import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';
import { YouTubePlaylist, RedditPost, TwitterPost } from '@/lib/types/social';
import { getUserContent } from '@/lib/firebase/db';

interface ContentState {
  youtube: YouTubePlaylist[];
  reddit: RedditPost[];
  twitter: TwitterPost[];
  loading: {
    youtube: boolean;
    reddit: boolean;
    twitter: boolean;
  };
}

export function useContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState<ContentState>({
    youtube: [],
    reddit: [],
    twitter: [],
    loading: {
      youtube: true,
      reddit: true,
      twitter: true,
    },
  });

  useEffect(() => {
    if (!user) return;

    const fetchContent = async () => {
      try {
        const [youtubeContent, redditContent, twitterContent] = await Promise.all([
          getUserContent(user.uid, 'youtube'),
          getUserContent(user.uid, 'reddit'),
          getUserContent(user.uid, 'twitter'),
        ]);

        setContent({
          youtube: youtubeContent as YouTubePlaylist[],
          reddit: redditContent as RedditPost[],
          twitter: twitterContent as TwitterPost[],
          loading: {
            youtube: false,
            reddit: false,
            twitter: false,
          },
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch your content',
          variant: 'destructive',
        });
        setContent(prev => ({
          ...prev,
          loading: {
            youtube: false,
            reddit: false,
            twitter: false,
          },
        }));
      }
    };

    fetchContent();
  }, [user, toast]);

  return content;
}