import axios from 'axios';

const SPOTIFY_API_URL = import.meta.env.VITE_SPOTIFY_API_URL || 'https://api.spotify.com/v1';
const YOUTUBE_API_URL = import.meta.env.VITE_YOUTUBE_API_URL || 'https://www.googleapis.com/youtube/v3';

const SPOTIFY_ACCESS_TOKEN = import.meta.env.VITE_SPOTIFY_ACCESS_TOKEN;
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const getSpotifyPlaylist = async (playlistId: string) => {
  try {
    console.log('Fetching Spotify playlist with ID:', playlistId);
    const response = await axios.get(`${SPOTIFY_API_URL}/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${SPOTIFY_ACCESS_TOKEN}`,
      },
    });
    console.log('Spotify playlist response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching Spotify playlist:', error);
    throw error;
  }
};

const getYouTubePlaylist = async (playlistId: string) => {
  try {
    console.log('Fetching YouTube playlist with ID:', playlistId);
    const response = await axios.get(`${YOUTUBE_API_URL}/playlistItems`, {
      params: {
        part: 'snippet',
        playlistId,
        key: YOUTUBE_API_KEY,
        maxResults: 50,
      },
    });
    console.log('YouTube playlist response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching YouTube playlist:', error);
    throw error;
  }
};

export { getSpotifyPlaylist, getYouTubePlaylist };
