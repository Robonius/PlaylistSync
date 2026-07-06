import { describe, expect, test, mock, afterEach } from 'bun:test';
import axios from 'axios';
import { checkAuthStatus } from './api';

mock.module('axios', () => ({
  default: {
    get: mock(),
    post: mock(),
  }
}));

describe('api.ts - checkAuthStatus', () => {
  afterEach(() => {
    mock.restore();
  });

  test('should return auth status from api on success', async () => {
    const mockData = { spotify: true, youtube: false };
    // @ts-expect-error mock
    axios.get.mockResolvedValueOnce({ data: mockData });

    const result = await checkAuthStatus();

    expect(axios.get).toHaveBeenCalledWith('/api/auth/status');
    expect(result).toEqual(mockData);
  });

  test('should return fallback { spotify: false, youtube: false } on error', async () => {
    // @ts-expect-error mock
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    const result = await checkAuthStatus();

    expect(axios.get).toHaveBeenCalledWith('/api/auth/status');
    expect(result).toEqual({ spotify: false, youtube: false });
  });
});
