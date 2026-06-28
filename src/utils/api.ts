import axios from 'axios';
import { getEnv } from './env';
import { sanitizeError } from './sanitizeError';

const SPOTIFY_API_URL = getEnv('SPOTIFY_API_URL', 'https://api.spotify.com/v1');
const YOUTUBE_API_URL = getEnv('YOUTUBE_API_URL', 'https://www.googleapis.com/youtube/v3');

const SYSTEM_SPOTIFY_API_KEY = getEnv('SPOTIFY_API_KEY');
const SYSTEM_YOUTUBE_API_KEY = getEnv('YOUTUBE_API_KEY');

const getSpotifyPlaylist = async (playlistId: string, spotifyToken: string = '') => {
  try {
    const token = spotifyToken || SYSTEM_SPOTIFY_API_KEY;
    console.log('Fetching Spotify playlist with ID:', playlistId);
    let url: string | null = `${SPOTIFY_API_URL}/playlists/${playlistId}/tracks`;
    let allItems: any[] = [];
    while (url) {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      allItems = allItems.concat(response.data.items);
      url = response.data.next;
    }
    console.log('Spotify playlist fetched items:', allItems.length);
    return { tracks: { items: allItems } };
  } catch (error) {
    console.error('Error fetching Spotify playlist');
    throw sanitizeError(error);
  }
};

const getYouTubePlaylist = async (playlistId: string, youtubeApiKey: string = '') => {
  try {
    const key = youtubeApiKey || SYSTEM_YOUTUBE_API_KEY;
    console.log('Fetching YouTube playlist with ID:', playlistId);
    let allItems: any[] = [];
    let nextPageToken = '';
    do {
      const response = await axios.get(`${YOUTUBE_API_URL}/playlistItems`, {
        params: {
          part: 'snippet',
          playlistId,
          key: key && !key.startsWith('ya29.') ? key : undefined,
          maxResults: 50,
          pageToken: nextPageToken || undefined,
        },
        headers: key && key.startsWith('ya29.') ? { Authorization: `Bearer ${key}` } : {},
      });
      allItems = allItems.concat(response.data.items);
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);
    console.log('YouTube playlist fetched items:', allItems.length);
    return { items: allItems };
  } catch (error) {
    console.error('Error fetching YouTube playlist');
    throw sanitizeError(error);
  }
};

export { getSpotifyPlaylist, getYouTubePlaylist };

export const createSpotifyPlaylist = async (userId: string, name: string, token: string) => {
  try {
    const authToken = token || SYSTEM_SPOTIFY_API_KEY;
    const response = await axios.post(`${SPOTIFY_API_URL}/users/${userId}/playlists`, {
      name: name,
      description: 'Imported by RoboLab Sync Tool',
      public: false
    }, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating Spotify playlist');
    throw sanitizeError(error);
  }
};

export const addItemsToSpotifyPlaylist = async (playlistId: string, trackUris: string[], token: string) => {
  try {
    const authToken = token || SYSTEM_SPOTIFY_API_KEY;
    for (let i = 0; i < trackUris.length; i += 100) {
      const chunk = trackUris.slice(i, i + 100);
      await axios.post(`${SPOTIFY_API_URL}/playlists/${playlistId}/tracks`, {
        uris: chunk
      }, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    }
  } catch (error) {
    console.error('Error adding items to Spotify playlist');
    throw sanitizeError(error);
  }
};

export const searchSpotifyTrack = async (query: string, token: string) => {
  try {
    const authToken = token || SYSTEM_SPOTIFY_API_KEY;
    const response = await axios.get(`${SPOTIFY_API_URL}/search`, {
      params: { q: query, type: 'track', limit: 1 },
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const items = response.data.tracks.items;
    return items.length > 0 ? items[0] : null;
  } catch (error) {
    console.error('Error searching Spotify track');
    return null;
  }
};

export const getSpotifyUserId = async (token: string) => {
  try {
    const authToken = token || SYSTEM_SPOTIFY_API_KEY;
    const response = await axios.get(`${SPOTIFY_API_URL}/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data.id;
  } catch (error) {
    console.error('Error getting Spotify user ID');
    throw sanitizeError(error);
  }
};

export const createYouTubePlaylist = async (title: string, token: string) => {
  try {
    const authToken = token || SYSTEM_YOUTUBE_API_KEY;
    const response = await axios.post(`${YOUTUBE_API_URL}/playlists`, {
      snippet: { title: title, description: 'Imported by RoboLab Sync Tool' },
      status: { privacyStatus: 'private' }
    }, {
      params: { part: 'snippet,status' },
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating YouTube playlist');
    throw sanitizeError(error);
  }
};

export const addItemsToYouTubePlaylist = async (playlistId: string, videoIds: string[], token: string) => {
  try {
    const authToken = token || SYSTEM_YOUTUBE_API_KEY;
    for (const videoId of videoIds) {
      await axios.post(`${YOUTUBE_API_URL}/playlistItems`, {
        snippet: {
          playlistId: playlistId,
          resourceId: { kind: 'youtube#video', videoId: videoId }
        }
      }, {
        params: { part: 'snippet' },
        headers: { Authorization: `Bearer ${authToken}` },
      });
    }
  } catch (error) {
    console.error('Error adding items to YouTube playlist');
    throw sanitizeError(error);
  }
};

export const searchYouTubeTrack = async (query: string, apiKey: string) => {
  try {
    const key = apiKey || SYSTEM_YOUTUBE_API_KEY;
    const response = await axios.get(`${YOUTUBE_API_URL}/search`, {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        videoCategoryId: '10',
        key: key && !key.startsWith('ya29.') ? key : undefined,
        maxResults: 1
      },
      headers: key && key.startsWith('ya29.') ? { Authorization: `Bearer ${key}` } : {},
    });
    const items = response.data.items;
    return items.length > 0 ? items[0] : null;
  } catch (error) {
    console.error('Error searching YouTube track');
    return null;
  }
};
