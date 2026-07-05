import { expect, test, describe } from "bun:test";
import { comparePlaylists, type Song } from "./playlistComparison";

describe("comparePlaylists", () => {
  const song1: Song = { title: "Song A", artist: "Artist 1", album: "Album X", platformId: "1" };
  const song2: Song = { title: "Song B", artist: "Artist 2", album: "Album Y", platformId: "2" };
  const song3: Song = { title: "Song C", artist: "Artist 3", album: "Album Z", platformId: "3" };

  // Same as song1 but different platformId
  const song1yt: Song = { title: "Song A", artist: "Artist 1", album: "Album X", platformId: "yt1" };
  const song4yt: Song = { title: "Song D", artist: "Artist 4", album: "Album W", platformId: "yt4" };

  test("returns empty result for empty playlists", () => {
    const result = comparePlaylists([], []);
    expect(result.common).toEqual([]);
    expect(result.spotifyUnique).toEqual([]);
    expect(result.youtubeUnique).toEqual([]);
    expect(result.totalTracks).toBe(0);
  });

  test("handles completely disjoint playlists", () => {
    const spotify = [song1, song2];
    const youtube = [song3, song4yt];

    const result = comparePlaylists(spotify, youtube);
    expect(result.common).toEqual([]);
    expect(result.spotifyUnique).toEqual([song1, song2]);
    expect(result.youtubeUnique).toEqual([song3, song4yt]);
    expect(result.totalTracks).toBe(4);
  });

  test("handles exact match playlists", () => {
    const spotify = [song1, song2];
    const youtube = [song1yt, { ...song2, platformId: "yt2" }];

    const result = comparePlaylists(spotify, youtube);
    expect(result.common).toEqual([song1, song2]);
    expect(result.spotifyUnique).toEqual([]);
    expect(result.youtubeUnique).toEqual([]);
    expect(result.totalTracks).toBe(2);
  });

  test("handles partial overlap", () => {
    const spotify = [song1, song2];
    const youtube = [song1yt, song3];

    const result = comparePlaylists(spotify, youtube);
    expect(result.common).toEqual([song1]);
    expect(result.spotifyUnique).toEqual([song2]);
    expect(result.youtubeUnique).toEqual([song3]);
    expect(result.totalTracks).toBe(3);
  });

  test("is case sensitive (current behavior)", () => {
    const spotify = [song1];
    const youtube = [{ ...song1, title: "song a" }]; // lower case title

    const result = comparePlaylists(spotify, youtube);
    expect(result.common).toEqual([]);
    expect(result.spotifyUnique).toEqual([song1]);
    expect(result.youtubeUnique).toEqual([youtube[0]]);
    expect(result.totalTracks).toBe(2);
  });

  test("handles duplicates based on current filter behavior", () => {
    // If Spotify has duplicate songs, both should be kept in common/unique
    const spotify = [song1, song1, song2];
    const youtube = [song1yt, song3];

    const result = comparePlaylists(spotify, youtube);

    expect(result.common).toEqual([song1, song1]); // Keeps all matching
    expect(result.spotifyUnique).toEqual([song2]);
    expect(result.youtubeUnique).toEqual([song3]);
    expect(result.totalTracks).toBe(3 + 2 - 2); // 5 - 2 = 3
  });
});
