import axios from 'axios';
import { sanitizeError } from './sanitizeError';

export const getSpotifyPlaylist = async (playlistId: string) => {
  try {
    const response = await axios.get('/api/spotify/playlist', {
      params: { playlistId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Spotify playlist');
    throw sanitizeError(error);
  }
};

export const getYouTubePlaylist = async (playlistId: string) => {
  try {
    const response = await axios.get('/api/youtube/playlist', {
      params: { playlistId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching YouTube playlist');
    throw sanitizeError(error);
  }
};

export const createYouTubePlaylist = async (title: string, description: string) => {
  try {
    const response = await axios.post('/api/youtube/playlist', {
      title,
      description
    });
    return response.data.playlistId;
  } catch (error) {
    console.error('Error creating YouTube playlist');
    throw sanitizeError(error);
  }
};

export const addItemsToYouTubePlaylist = async (playlistId: string, videoId: string) => {
  try {
    await axios.post('/api/youtube/playlist/items', {
      playlistId,
      videoId
    });
  } catch (error) {
    console.error('Error adding items to YouTube playlist');
    throw sanitizeError(error);
  }
};

export const searchYouTubeTrack = async (title: string, artist: string) => {
  try {
    const q = `${title} ${artist}`;
    const response = await axios.get('/api/youtube/search', {
      params: { q }
    });
    return response.data.videoId;
  } catch (error) {
    console.error('Error searching YouTube track');
    return null;
  }
};

export const checkAuthStatus = async () => {
  try {
    const response = await axios.get('/api/auth/status');
    return response.data;
  } catch (error) {
    return { spotify: false, youtube: false };
  }
};

export const getSpotifyUserId = async () => '';
export const createSpotifyPlaylist = async () => ({});
export const searchSpotifyTrack = async () => null;
export const addItemsToSpotifyPlaylist = async () => {};
