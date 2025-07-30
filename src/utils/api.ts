import axios from 'axios';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

const SPOTIFY_ACCESS_TOKEN = 'BQC0mxZFXwPXoaXDgDzTUvR_4NZZOChO0dllAPQcu8mll1AgVJ7OZtW6fWG198HWadBqU9kW69R6y3t6GPHmAj-MQfn_3Y67m2I86W3VtjqIRqazn_BPqiLKyTIGJmIuiY3P5i2kgePHhRreZhWGq1VftUJBUfDjL6cmBPe-yG2qdtb3nlAWSzXEYeMuDKZYXxB-Q7LjhuvtEM0QO9DzbhMJOmFINr6Ay3b5iBM3iRepvIyrvMxdpsqjZtLuu7ishIWTlT1bWeszbowuFly53sFpHd1di5zKUrr1r9POt9VG4hof_DjqEMGlN4XVIMBS0RxWNo9Lv72dr3MDun96OSvFzh6kbwFjBiPymXBLeNyrBx_vYCD2'; // Replace with your actual Spotify access token
const YOUTUBE_API_KEY = 'AIzaSyDBLYrojvGYTWUx7FkZ0eyzMxiYv1sbpQw'; // Replace with your actual YouTube API key

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