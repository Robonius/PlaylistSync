import axios from 'axios';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

const getSpotifyPlaylist = async (playlistId: string, accessToken: string) => {
  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Spotify playlist:', error);
    throw error;
  }
};

const getYouTubePlaylist = async (playlistId: string, apiKey: string) => {
  try {
    const response = await axios.get(`${YOUTUBE_API_URL}/playlistItems`, {
      params: {
        part: 'snippet',
        playlistId,
        key: apiKey,
        maxResults: 50,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching YouTube playlist:', error);
    throw error;
  }
};

export { getSpotifyPlaylist, getYouTubePlaylist };