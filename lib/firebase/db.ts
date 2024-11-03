import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from './config';
import { YouTubePlaylist, RedditPost, TwitterPost } from '@/lib/types/social';

export const saveYouTubePlaylist = async (userId: string, playlist: YouTubePlaylist) => {
  try {
    await addDoc(collection(db, 'playlists'), {
      userId,
      ...playlist,
      type: 'youtube',
      createdAt: new Date(),
    });
  } catch (error) {
    throw error;
  }
};

export const saveRedditPost = async (userId: string, post: RedditPost) => {
  try {
    await addDoc(collection(db, 'posts'), {
      userId,
      ...post,
      type: 'reddit',
      createdAt: new Date(),
    });
  } catch (error) {
    throw error;
  }
};

export const saveTwitterPost = async (userId: string, post: TwitterPost) => {
  try {
    await addDoc(collection(db, 'posts'), {
      userId,
      ...post,
      type: 'twitter',
      createdAt: new Date(),
    });
  } catch (error) {
    throw error;
  }
};

export const getUserContent = async (userId: string, type: string) => {
  try {
    const q = query(
      collection(db, type === 'youtube' ? 'playlists' : 'posts'),
      where('userId', '==', userId),
      where('type', '==', type)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};