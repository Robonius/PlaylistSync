import axios from 'axios';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

const SPOTIFY_ACCESS_TOKEN = 'YOUR_SPOTIFY_ACCESS_TOKEN'; // Replace with your actual Spotify access token
const YOUTUBE_API_KEY = 'AIzaSyDBLYrojvGYTWUx7FkZ0eyzMxiYv1sbpQwEY'; // Replace with your actual YouTube API key

const getSpotifyPlaylist = async (playlistId: string) => {
  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${SPOTIFY_ACCESS_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Spotify playlist:', error);
    throw error;
  }
};

const getYouTubePlaylist = async (playlistId: string) => {
  try {
    const response = await axios.get(`${YOUTUBE_API_URL}/playlistItems`, {
      params: {
        part: 'snippet',
        playlistId,
        key: YOUTUBE_API_KEY,
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