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
      console.log('Spotify URL:', spotifyUrl);
      console.log('YouTube URL:', youtubeUrl);

      const spotifyPlaylistId = spotifyUrl.split('/').pop();
      const youtubePlaylistId = youtubeUrl.split('=').pop();

      console.log('Spotify Playlist ID:', spotifyPlaylistId);
      console.log('YouTube Playlist ID:', youtubePlaylistId);

      if (!spotifyPlaylistId || !youtubePlaylistId) {
        throw new Error('Invalid playlist URLs. Please check the URLs and try again.');
      }

      const spotifyData = await getSpotifyPlaylist(spotifyPlaylistId);
      console.log('Spotify Data:', spotifyData);

      const youtubeData = await getYouTubePlaylist(youtubePlaylistId);
      console.log('YouTube Data:', youtubeData);

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
      console.error('Error syncing playlists:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        setError(`Error: ${error.response.data.error.message}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        setError('No response received from the server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        setError(`Error: ${error.message}`);
      }
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
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Playlist Comparison</h1>
        <InputField label="Spotify Playlist URL" value={spotifyUrl} onChange={(e) => setSpotifyUrl(e.target.value)} />
        <InputField label="YouTube Music Playlist URL" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
        <Button label="Sync Playlists" onClick={handleSyncPlaylists} disabled={loading} />
        <Button label="Export to CSV" onClick={handleExportToCSV} disabled={loading || !comparisonResults.spotifyUnique.length || !comparisonResults.youtubeUnique.length} />
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Side-by-Side Comparison</h2>
          <table className="min-w-full bg-gray-800 text-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-700">Spotify Song Name</th>
                <th className="py-2 px-4 border-b border-gray-700">Spotify Artist Name</th>
                <th className="py-2 px-4 border-b border-gray-700">Spotify Album</th>
                <th className="py-2 px-4 border-b border-gray-700">YouTube Song Name</th>
                <th className="py-2 px-4 border-b border-gray-700">YouTube Artist Name</th>
                <th className="py-2 px-4 border-b border-gray-700">YouTube Album</th>
              </tr>
            </thead>
            <tbody>
              {comparisonResults.spotifyUnique.map((spotifySong, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b border-gray-700">{spotifySong.title}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{spotifySong.artist}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{spotifySong.album}</td>
                  <td className="py-2 px-4 border-b border-gray-700"></td>
                  <td className="py-2 px-4 border-b border-gray-700"></td>
                  <td className="py-2 px-4 border-b border-gray-700"></td>
                </tr>
              ))}
              {comparisonResults.youtubeUnique.map((youtubeSong, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b border-gray-700"></td>
                  <td className="py-2 px-4 border-b border-gray-700"></td>
                  <td className="py-2 px-4 border-b border-gray-700"></td>
                  <td className="py-2 px-4 border-b border-gray-700">{youtubeSong.title}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{youtubeSong.artist}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{youtubeSong.album}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Index;