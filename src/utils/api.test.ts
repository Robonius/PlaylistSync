import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { createYouTubePlaylist, getSpotifyPlaylist, getYouTubePlaylist } from './api';

vi.mock('axios');

describe('api.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createYouTubePlaylist', () => {
    it('should create a YouTube playlist successfully', async () => {
      const mockResponse = { data: { id: 'new_playlist_id' } };
      vi.mocked(axios.post).mockResolvedValueOnce(mockResponse);

      const result = await createYouTubePlaylist('Test Playlist', 'test_token');

      expect(axios.post).toHaveBeenCalledWith(
        'https://www.googleapis.com/youtube/v3/playlists',
        {
          snippet: {
            title: 'Test Playlist',
            description: 'Imported by Playlist Comparison Tool'
          },
          status: {
            privacyStatus: 'private'
          }
        },
        {
          params: {
            part: 'snippet,status',
          },
          headers: {
            Authorization: 'Bearer test_token',
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle errors when creating a playlist', async () => {
      const mockError = new Error('API Error');
      vi.mocked(axios.post).mockRejectedValueOnce(mockError);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(createYouTubePlaylist('Test Playlist', 'test_token'))
        .rejects
        .toThrow('API Error');

      expect(consoleSpy).toHaveBeenCalledWith('Error creating YouTube playlist');

      consoleSpy.mockRestore();
    });
  });

  describe('getSpotifyPlaylist', () => {
    it('should handle errors when fetching a Spotify playlist', async () => {
      const mockError = new Error('Spotify API Error');
      vi.mocked(axios.get).mockRejectedValueOnce(mockError);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await expect(getSpotifyPlaylist('spotify_playlist_id'))
        .rejects
        .toThrow('Spotify API Error');

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching Spotify playlist');

      consoleSpy.mockRestore();
      logSpy.mockRestore();
    });
  });

  describe('getYouTubePlaylist', () => {
    it('should handle errors when fetching a YouTube playlist', async () => {
      const mockError = new Error('YouTube API Error');
      vi.mocked(axios.get).mockRejectedValueOnce(mockError);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await expect(getYouTubePlaylist('youtube_playlist_id'))
        .rejects
        .toThrow('YouTube API Error');

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching YouTube playlist');

      consoleSpy.mockRestore();
      logSpy.mockRestore();
    });
  });
});
