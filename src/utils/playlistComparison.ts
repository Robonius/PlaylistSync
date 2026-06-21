interface Song {
  title: string;
  artist: string;
  album: string;
  duration: number;
  platformId: string;
}

const comparePlaylists = (spotifySongs: Song[], youtubeSongs: Song[]) => {
  const youtubeSet = new Set(youtubeSongs.map((s) => `${s.title}|${s.artist}`));
  const spotifySet = new Set(spotifySongs.map((s) => `${s.title}|${s.artist}`));

  const spotifyUnique = spotifySongs.filter(
    (spotifySong) => !youtubeSet.has(`${spotifySong.title}|${spotifySong.artist}`)
  );

  const youtubeUnique = youtubeSongs.filter(
    (youtubeSong) => !spotifySet.has(`${youtubeSong.title}|${youtubeSong.artist}`)
  );

  return { spotifyUnique, youtubeUnique };
};

export { comparePlaylists };