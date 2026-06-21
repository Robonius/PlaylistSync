import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { addItemsToSpotifyPlaylist } from './api';

vi.mock('axios');

describe('addItemsToSpotifyPlaylist', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not call axios.post when given an empty list of track URIs', async () => {
    const playlistId = 'test-playlist-id';
    const trackUris: string[] = [];
    const token = 'test-token';

    await addItemsToSpotifyPlaylist(playlistId, trackUris, token);

    expect(axios.post).not.toHaveBeenCalled();
  });
});
