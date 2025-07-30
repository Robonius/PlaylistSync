interface Song {
  title: string;
  artist: string;
  album: string;
  duration: number;
  platformId: string;
}

const comparePlaylists = (spotifySongs: Song[], youtubeSongs: Song[]) => {
  const spotifyUnique = spotifySongs.filter(
    (spotifySong) => !youtubeSongs.some((youtubeSong) => youtubeSong.title === spotifySong.title && youtubeSong.artist === spotifySong.artist)
  );

  const youtubeUnique = youtubeSongs.filter(
    (youtubeSong) => !spotifySongs.some((spotifySong) => spotifySong.title === youtubeSong.title && spotifySong.artist === youtubeSong.artist)
  );

  return { spotifyUnique, youtubeUnique };
};

export { comparePlaylists };