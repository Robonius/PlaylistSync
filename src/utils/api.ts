import axios from 'axios';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

const SPOTIFY_ACCESS_TOKEN = 'BQAbrvQcv19m1rYtp9GwhEUyMhAttTJPl2T24Oyq9CfGrRzCeoXYj45h250SAzq_WFLCc9hEWR6NamIYly2cTJmSDQlHQioeOfQvFaBfqSl86jFDZlM6hNW43jYEDDcQru9W8mEsSnIGjdh41uyd5e7ksmJpbbJUsKeBP-nqGhI0htwdNhIg748_N8MZr856Mnvv4RyFJ8m1hEc3ds4m1VOBOdCTDu_GSU99Iyp8ex0mnNyvn6kUM94sM-4Jud4-hSyDVT1zgzGjFf5tf9HqHEllw8ACbDCZYSOmG0IOpSmuOySYgc1YqhJ1Qtg10GZEry-IeDZL3qfJZ9PcOCjKdr8QGsjYo7cnvAA9mH7O5w4SQtaGnEtb'; // Replace with your actual Spotify access token
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
export const createSpotifyPlaylist = async (userId: string, name: string, token: string) => {
  try {
    const response = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
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
