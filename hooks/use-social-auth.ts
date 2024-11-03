"use client";

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  initiateYouTubeAuth,
  initiateRedditAuth,
  initiateTwitterAuth,
} from '@/lib/api/oauth';

export function useSocialAuth() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const connectYouTube = async () => {
    try {
      setLoading(true);
      await initiateYouTubeAuth();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect YouTube account',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const connectReddit = async () => {
    try {
      setLoading(true);
      await initiateRedditAuth();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect Reddit account',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const connectTwitter = async () => {
    try {
      setLoading(true);
      await initiateTwitterAuth();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect Twitter account',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    connectYouTube,
    connectReddit,
    connectTwitter,
  };
}