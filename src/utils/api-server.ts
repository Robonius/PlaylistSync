import {
  getSpotifyPlaylist as getSpotifyPlaylistClient,
  getYouTubePlaylist as getYouTubePlaylistClient,
  searchSpotifyTrack as searchSpotifyTrackClient,
  searchYouTubeTrack as searchYouTubeTrackClient
} from './api';

export const getSpotifyPlaylistServer = async (playlistId: string, spotifyToken: string) => {
  return getSpotifyPlaylistClient(playlistId, spotifyToken);
};

export const getYouTubePlaylistServer = async (playlistId: string, youtubeApiKey: string) => {
  return getYouTubePlaylistClient(playlistId, youtubeApiKey);
};

export const searchSpotifyTrackServer = async (query: string, token: string) => {
  return searchSpotifyTrackClient(query, token);
};

export const searchYouTubeTrackServer = async (query: string, apiKey: string) => {
  return searchYouTubeTrackClient(query, apiKey);
};
