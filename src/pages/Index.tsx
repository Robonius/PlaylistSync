import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { getSpotifyPlaylist, getYouTubePlaylist } from '../utils/api';
import { comparePlaylists } from '../utils/playlistComparison';
import { exportToCSV } from '../utils/csvExport';

const Index = () => {
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [spotifySongs, setSpotifySongs] = useState([]);
  const [youtubeSongs, setYoutubeSongs] = useState([]);
  const [comparisonResults, setComparisonResults] = useState({ spotifyUnique: [], youtubeUnique: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSyncPlaylists = async () => {
    setLoading(true);
    setError('');
    try {
      const spotifyPlaylistId = spotifyUrl.split('/').pop();
      const youtubePlaylistId = youtubeUrl.split('=').pop();

      const spotifyData = await getSpotifyPlaylist(spotifyPlaylistId);
      const youtubeData = await getYouTubePlaylist(youtubePlaylistId);

      const spotifySongs = spotifyData.tracks.items.map((item: any) => ({
        title: item.track.name,
        artist: item.track.artists[0].name,
        album: item.track.album.name,
        duration: item.track.duration_ms,
        platformId: item.track.id,
      }));

      const youtubeSongs = youtubeData.items.map((item: any) => ({
        title: item.snippet.title,
        artist: item.snippet.videoOwnerChannelTitle,
        album: '',
        duration: 0,
        platformId: item.snippet.resourceId.videoId,
      }));

      setSpotifySongs(spotifySongs);
      setYoutubeSongs(youtubeSongs);

      const comparisonResults = comparePlaylists(spotifySongs, youtubeSongs);
      setComparisonResults(comparisonResults);
    } catch (error) {
      setError('Error syncing playlists. Please check the URLs and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportToCSV = () => {
    const data = [
      ...comparisonResults.spotifyUnique.map((song) => ({ ...song, platform: 'Spotify' })),
      ...comparisonResults.youtubeUnique.map((song) => ({ ...song, platform: 'YouTube' })),
    ];
    exportToCSV(data, 'playlist_comparison.csv');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Playlist Comparison</h1>
      <InputField label="Spotify Playlist URL" value={spotifyUrl} onChange={(e) => setSpotifyUrl(e.target.value)} />
      <InputField label="YouTube Music Playlist URL" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
      <Button label="Sync Playlists" onClick={handleSyncPlaylists} disabled={loading} />
      <Button label="Export to CSV" onClick={handleExportToCSV} disabled={loading || !comparisonResults.spotifyUnique.length || !comparisonResults.youtubeUnique.length} />
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Spotify Unique Songs</h2>
        <ul>
          {comparisonResults.spotifyUnique.map((song, index) => (
            <li key={index} className="mb-2">
              {song.title} by {song.artist}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">YouTube Unique Songs</h2>
        <ul>
          {comparisonResults.youtubeUnique.map((song, index) => (
            <li key={index} className="mb-2">
              {song.title} by {song.artist}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Index;