import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { addItemsToYouTubePlaylist } from '../api';

vi.mock('axios');

describe('addItemsToYouTubePlaylist', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should not make any API requests if videoIds array is empty', async () => {
    const playlistId = 'playlist-123';
    const videoIds: string[] = [];
    const token = 'fake-token';

    await addItemsToYouTubePlaylist(playlistId, videoIds, token);

    expect(axios.post).not.toHaveBeenCalled();
  });

  it('should make an API request for each videoId', async () => {
    const playlistId = 'playlist-123';
    const videoIds = ['video-1', 'video-2'];
    const token = 'fake-token';

    vi.mocked(axios.post).mockResolvedValue({ data: {} });

    await addItemsToYouTubePlaylist(playlistId, videoIds, token);

    expect(axios.post).toHaveBeenCalledTimes(2);
    expect(axios.post).toHaveBeenNthCalledWith(
      1,
      'https://www.googleapis.com/youtube/v3/playlistItems',
      {
        snippet: {
          playlistId: playlistId,
          resourceId: {
            kind: 'youtube#video',
            videoId: 'video-1',
          },
        },
      },
      {
        params: {
          part: 'snippet',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    expect(axios.post).toHaveBeenNthCalledWith(
      2,
      'https://www.googleapis.com/youtube/v3/playlistItems',
      {
        snippet: {
          playlistId: playlistId,
          resourceId: {
            kind: 'youtube#video',
            videoId: 'video-2',
          },
        },
      },
      {
        params: {
          part: 'snippet',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  });

  it('should throw an error if the API request fails', async () => {
    const playlistId = 'playlist-123';
    const videoIds = ['video-1'];
    const token = 'fake-token';
    const error = new Error('API Error');

    vi.mocked(axios.post).mockRejectedValue(error);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(addItemsToYouTubePlaylist(playlistId, videoIds, token)).rejects.toThrow(error);
    consoleSpy.mockRestore();
  });
});
