import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { searchSpotifyTrack } from '../api';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('searchSpotifyTrack', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the first track if items are returned', async () => {
    const mockData = {
      data: {
        tracks: {
          items: [{ id: '1', name: 'Test Track' }, { id: '2', name: 'Second Track' }]
        }
      }
    };
    mockedAxios.get.mockResolvedValueOnce(mockData);

    const result = await searchSpotifyTrack('test query', 'test-token');

    expect(result).toEqual({ id: '1', name: 'Test Track' });
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/search',
      expect.objectContaining({
        params: { q: 'test query', type: 'track', limit: 1 },
        headers: { Authorization: 'Bearer test-token' }
      })
    );
  });

  it('should return null if no items are returned', async () => {
    const mockData = {
      data: {
        tracks: {
          items: []
        }
      }
    };
    mockedAxios.get.mockResolvedValueOnce(mockData);

    const result = await searchSpotifyTrack('test query', 'test-token');

    expect(result).toBeNull();
  });

  it('should return null if axios throws an error', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    // Spy on console.error to avoid test output noise
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await searchSpotifyTrack('test query', 'test-token');

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Error searching Spotify track:', expect.any(Error));

    consoleSpy.mockRestore();
  });
});
