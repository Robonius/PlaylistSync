import axios from 'axios';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

const SPOTIFY_ACCESS_TOKEN = 'BQB17I22wJb0HKQZgONs6ejb2gOlKGqI4atZvW3MIP5Nm8uK-AzdJSqbgNJVn533k4HppdLJkVI83p9ydH4kU6xZ18ASo5oUkuvmffs9iDrEmc3fAMUsSe1yugqxE9iY9GlS_FZbZK0dEf2D9zk-DweeDzxBgRs2vnuK_TPK5nxQcdeQlELhpJ4fTVwMaOykTUdQ8pooV-DVOcv2WBGvrWvJuqUP1t7HrKDdLR_g7-BE3Iz_E3FOEPk0yBa5xuhkBC1wYSbtp3fErv5uwCwOVwDChccbbSmbPC6ufGgpJDVJJtWPR79B8Vk2bhL3auDbaPjXHCD2U6s4d0z-8IrZOR-JTPAUKtfX1FtCwSoAU5S4A0ZW6OUuEN'; // Replace with your actual Spotify access token
const YOUTUBE_API_KEY = 'AIzaSyDBLYrojvGYTWUx7FkZ0eyzMxiYv1sbpQwEY'; // Replace with your actual YouTube API key

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