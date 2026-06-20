import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { getSpotifyPlaylist, getYouTubePlaylist } from '../utils/api';
import { comparePlaylists } from '../utils/playlistComparison';
import { exportToCSV } from '../utils/csvExport';

interface SpotifyTrackItem {
  track: {
    name: string;
    artists: { name: string }[];
    album: { name: string };
    duration_ms: number;
    id: string;
  };
}

interface YouTubePlaylistItem {
  snippet: {
    title: string;
    videoOwnerChannelTitle: string;
    resourceId: {
      videoId: string;
    };
  };
}


const Index = () => {
  const [spotifyUrl, setSpotifyUrl] = useState('https://open.spotify.com/playlist/6rxBkysajQ9fMM4a9Pl104');
  const [youtubeUrl, setYoutubeUrl] = useState('https://music.youtube.com/playlist?list=PLt7bCmudeShKsk7MDN5_Vn8HUUv0rCNr4');
  const [spotifySongs, setSpotifySongs] = useState([]);
  const [youtubeSongs, setYoutubeSongs] = useState([]);
  const [comparisonResults, setComparisonResults] = useState({ spotifyUnique: [], youtubeUnique: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('both'); // 'spotify', 'youtube', 'both'

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

      const spotifySongs = spotifyData.tracks.items.map((item: SpotifyTrackItem) => ({
        title: item.track.name,
        artist: item.track.artists[0].name,
        album: item.track.album.name,
        duration: item.track.duration_ms,
        platformId: item.track.id,
      }));

      const youtubeSongs = youtubeData.items.map((item: YouTubePlaylistItem) => {
        const titleParts = item.snippet.title.split(' - ');
        let artist = titleParts.length > 1 ? titleParts[0] : item.snippet.videoOwnerChannelTitle;
        artist = artist.replace(' - Topic', ''); // Remove " - Topic" suffix
        const title = titleParts.length > 1 ? titleParts[1] : item.snippet.title;
        const album = titleParts.length > 2 ? titleParts[2] : ''; // Attempt to extract album name
        return {
          title,
          artist,
          album,
          duration: 0,
          platformId: item.snippet.resourceId.videoId,
        };
      });

      // Sort the songs by artist name
      spotifySongs.sort((a, b) => a.artist.localeCompare(b.artist));
      youtubeSongs.sort((a, b) => a.artist.localeCompare(b.artist));

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
        <div className="mt-4 flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${viewMode === 'spotify' ? 'bg-blue-500' : 'bg-gray-500'}`}
            onClick={() => setViewMode('spotify')}
            aria-pressed={viewMode === 'spotify'}
          >
            Show Spotify Playlist
          </button>
          <button
            className={`px-4 py-2 rounded ${viewMode === 'youtube' ? 'bg-blue-500' : 'bg-gray-500'}`}
            onClick={() => setViewMode('youtube')}
            aria-pressed={viewMode === 'youtube'}
          >
            Show YouTube Playlist
          </button>
          <button
            className={`px-4 py-2 rounded ${viewMode === 'both' ? 'bg-blue-500' : 'bg-gray-500'}`}
            onClick={() => setViewMode('both')}
            aria-pressed={viewMode === 'both'}
          >
            Show Both Playlists
          </button>
        </div>
        <div className="mt-4 flex space-x-4">
          {(viewMode === 'spotify' || viewMode === 'both') && (
            <div className="w-1/2">
              <h2 className="text-xl font-bold mb-2">Spotify Playlist</h2>
              <table className="min-w-full bg-gray-800 text-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-700">Song Name</th>
                    <th className="py-2 px-4 border-b border-gray-700">Artist Name</th>
                    <th className="py-2 px-4 border-b border-gray-700">Album</th>
                  </tr>
                </thead>
                <tbody>
                  {spotifySongs.map((song, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b border-gray-700">{song.title}</td>
                      <td className="py-2 px-4 border-b border-gray-700">{song.artist}</td>
                      <td className="py-2 px-4 border-b border-gray-700">{song.album}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {(viewMode === 'youtube' || viewMode === 'both') && (
            <div className="w-1/2">
              <h2 className="text-xl font-bold mb-2">YouTube Music Playlist</h2>
              <table className="min-w-full bg-gray-800 text-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-700">Song Name</th>
                    <th className="py-2 px-4 border-b border-gray-700">Artist Name</th>
                    <th className="py-2 px-4 border-b border-gray-700">Album</th>
                  </tr>
                </thead>
                <tbody>
                  {youtubeSongs.map((song, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b border-gray-700">{song.title}</td>
                      <td className="py-2 px-4 border-b border-gray-700">{song.artist}</td>
                      <td className="py-2 px-4 border-b border-gray-700">{song.album}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;