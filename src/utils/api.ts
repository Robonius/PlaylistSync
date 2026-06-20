import axios from 'axios';

const SPOTIFY_API_URL = import.meta.env.VITE_SPOTIFY_API_URL || 'https://api.spotify.com/v1';
const YOUTUBE_API_URL = import.meta.env.VITE_YOUTUBE_API_URL || 'https://www.googleapis.com/youtube/v3';


const getSpotifyPlaylist = async (playlistId: string, spotifyToken: string) => {
  try {
    console.log('Fetching Spotify playlist with ID:', playlistId);
    let url: string | null = `${SPOTIFY_API_URL}/playlists/${playlistId}/tracks`;
    let allItems: any[] = [];

    while (url) {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      });
      allItems = allItems.concat(response.data.items);
      url = response.data.next;
    }

    console.log('Spotify playlist fetched items:', allItems.length);
    return { tracks: { items: allItems } };
  } catch (error) {
    console.error('Error fetching Spotify playlist:', error);
    throw error;
  }
};

const getYouTubePlaylist = async (playlistId: string, youtubeApiKey: string) => {
  try {
    console.log('Fetching YouTube playlist with ID:', playlistId);
    let allItems: any[] = [];
    let nextPageToken = '';

    do {
      const response = await axios.get(`${YOUTUBE_API_URL}/playlistItems`, {
        params: {
          part: 'snippet',
          playlistId,
          key: youtubeApiKey,
          maxResults: 50,
          pageToken: nextPageToken || undefined,
        },
      });
      allItems = allItems.concat(response.data.items);
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    console.log('YouTube playlist fetched items:', allItems.length);
    return { items: allItems };
  } catch (error) {
    console.error('Error fetching YouTube playlist:', error);
    throw error;
  }
};

export { getSpotifyPlaylist, getYouTubePlaylist };
// --- Spotify Write API ---

export const createSpotifyPlaylist = async (userId: string, name: string, token: string) => {
  try {
    const response = await axios.post(`${SPOTIFY_API_URL}/users/${userId}/playlists`, {
      name: name,
      description: 'Imported by Playlist Comparison Tool',
      public: false
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating Spotify playlist:', error);
    throw error;
  }
};

export const addItemsToSpotifyPlaylist = async (playlistId: string, trackUris: string[], token: string) => {
  try {
    // Spotify API accepts max 100 tracks per request
    for (let i = 0; i < trackUris.length; i += 100) {
      const chunk = trackUris.slice(i, i + 100);
      await axios.post(`${SPOTIFY_API_URL}/playlists/${playlistId}/tracks`, {
        uris: chunk
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error('Error adding items to Spotify playlist:', error);
    throw error;
  }
};

export const searchSpotifyTrack = async (query: string, token: string) => {
  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/search`, {
      params: {
        q: query,
        type: 'track',
        limit: 1
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const items = response.data.tracks.items;
    return items.length > 0 ? items[0] : null;
  } catch (error) {
    console.error('Error searching Spotify track:', error);
    return null;
  }
};

export const getSpotifyUserId = async (token: string) => {
  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.id;
  } catch (error) {
    console.error('Error getting Spotify user ID:', error);
    throw error;
  }
};

// --- YouTube Write API ---

export const createYouTubePlaylist = async (title: string, token: string) => {
  try {
    const response = await axios.post(`${YOUTUBE_API_URL}/playlists`, {
      snippet: {
        title: title,
        description: 'Imported by Playlist Comparison Tool'
      },
      status: {
        privacyStatus: 'private'
      }
    }, {
      params: {
        part: 'snippet,status',
      },
      headers: {
        Authorization: `Bearer ${token}`, // Requires OAuth token, not just API key
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating YouTube playlist:', error);
    throw error;
  }
};

export const addItemsToYouTubePlaylist = async (playlistId: string, videoIds: string[], token: string) => {
  try {
    for (const videoId of videoIds) {
      await axios.post(`${YOUTUBE_API_URL}/playlistItems`, {
        snippet: {
          playlistId: playlistId,
          resourceId: {
            kind: 'youtube#video',
            videoId: videoId
          }
        }
      }, {
        params: {
          part: 'snippet',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error('Error adding items to YouTube playlist:', error);
    throw error;
  }
};

export const searchYouTubeTrack = async (query: string, apiKey: string) => {
  try {
    const response = await axios.get(`${YOUTUBE_API_URL}/search`, {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        videoCategoryId: '10', // Music category
        key: apiKey,
        maxResults: 1
      },
    });
    const items = response.data.items;
    return items.length > 0 ? items[0] : null;
  } catch (error) {
    console.error('Error searching YouTube track:', error);
    return null;
  }
};
