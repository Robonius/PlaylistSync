export interface Song {
  title: string;
  artist: string;
  album: string;
  duration?: number;
  platformId: string;
}

export interface ComparisonResult {
  common: Song[];
  spotifyUnique: Song[];
  youtubeUnique: Song[];
  totalTracks: number;
}

export const comparePlaylists = (spotifySongs: Song[], youtubeSongs: Song[]): ComparisonResult => {
  const youtubeSet = new Set(youtubeSongs.map((s) => `${s.title}|${s.artist}`));
  const spotifySet = new Set(spotifySongs.map((s) => `${s.title}|${s.artist}`));

  const spotifyUnique = spotifySongs.filter(
    (spotifySong) => !youtubeSet.has(`${spotifySong.title}|${spotifySong.artist}`)
  );

  const youtubeUnique = youtubeSongs.filter(
    (youtubeSong) => !spotifySet.has(`${youtubeSong.title}|${youtubeSong.artist}`)
  );

  // Simple intersection for "common"
  const common = spotifySongs.filter(
    (spotifySong) => youtubeSet.has(`${spotifySong.title}|${spotifySong.artist}`)
  );

  return {
    common,
    spotifyUnique,
    youtubeUnique,
    totalTracks: spotifySongs.length + youtubeSongs.length - common.length
  };
};
