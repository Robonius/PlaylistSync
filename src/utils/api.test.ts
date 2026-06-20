import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { createSpotifyPlaylist } from './api';

vi.mock('axios');

describe('createSpotifyPlaylist', () => {
  it('throws an error if axios.post fails', async () => {
    const mockError = new Error('Network error');
    vi.mocked(axios.post).mockRejectedValueOnce(mockError);

    // Silence console.error for the test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(createSpotifyPlaylist('testUser', 'testName', 'testToken')).rejects.toThrow('Network error');

    consoleSpy.mockRestore();
  });
});
