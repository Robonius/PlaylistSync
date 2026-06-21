import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { getSpotifyPlaylist, getYouTubePlaylist, createSpotifyPlaylist, addItemsToSpotifyPlaylist, searchSpotifyTrack, getSpotifyUserId, createYouTubePlaylist, addItemsToYouTubePlaylist, searchYouTubeTrack } from '../utils/api';
import { comparePlaylists } from '../utils/playlistComparison';
import { exportToCSV } from '../utils/csvExport';
import { importFromCSV } from '../utils/csvImport';

const Index = () => {
  const [spotifyUrl, setSpotifyUrl] = useState('https://open.spotify.com/playlist/6rxBkysajQ9fMM4a9Pl104');
  const [youtubeUrl, setYoutubeUrl] = useState('https://music.youtube.com/playlist?list=PLt7bCmudeShKsk7MDN5_Vn8HUUv0rCNr4');
  const [spotifyToken, setSpotifyToken] = useState('');
  const [youtubeApiKey, setYoutubeApiKey] = useState('');
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

      let spotifyPlaylistId = '';
      try {
        const url = new URL(spotifyUrl);
        spotifyPlaylistId = url.pathname.split('/').pop() || '';
      } catch (e) {
        spotifyPlaylistId = spotifyUrl.split('/').pop() || '';
      }

      let youtubePlaylistId = '';
      try {
        const url = new URL(youtubeUrl);
        youtubePlaylistId = url.searchParams.get('list') || '';
      } catch (e) {
        youtubePlaylistId = youtubeUrl.split('=').pop() || '';
      }

      console.log('Spotify Playlist ID:', spotifyPlaylistId);
      console.log('YouTube Playlist ID:', youtubePlaylistId);

      if (!spotifyPlaylistId || !youtubePlaylistId) {
        throw new Error('Invalid playlist URLs. Please check the URLs and try again.');
      }

      const spotifyData = await getSpotifyPlaylist(spotifyPlaylistId, spotifyToken);
      console.log('Spotify Data:', spotifyData);

      const youtubeData = await getYouTubePlaylist(youtubePlaylistId, youtubeApiKey);
      console.log('YouTube Data:', youtubeData);

      const spotifySongs = spotifyData.tracks.items.map((item: any) => ({
        title: item.track.name,
        artist: item.track.artists[0].name,
        album: item.track.album.name,
        duration: item.track.duration_ms,
        platformId: item.track.id,
      }));

      const youtubeSongs = youtubeData.items.map((item: any) => {
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

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const data = await importFromCSV(file);

      const importedSpotify: any[] = [];
      const importedYouTube: any[] = [];

      data.forEach((row: any) => {
        const song = {
          title: row.title || '',
          artist: row.artist || '',
          album: row.album || '',
          duration: parseInt(row.duration) || 0,
          platformId: row.platformId || ''
        };

        if (row.platform === 'Spotify') {
          importedSpotify.push(song);
        } else if (row.platform === 'YouTube') {
          importedYouTube.push(song);
        } else {
          // If no platform specified, default to adding to both for sync purposes
          importedSpotify.push(song);
          importedYouTube.push(song);
        }
      });

      setSpotifySongs(importedSpotify);
      setYoutubeSongs(importedYouTube);

      const comparisonResults = comparePlaylists(importedSpotify, importedYouTube);
      setComparisonResults(comparisonResults);

      alert('Successfully imported CSV!');
    } catch (e: unknown) {
      console.error(e);
      setError(`Error importing CSV: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleCopyToSpotify = async () => {
    if (!spotifyToken) {
      setError('Spotify Access Token is required to create playlists.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userId = await getSpotifyUserId(spotifyToken);
      const newPlaylist = await createSpotifyPlaylist(userId, 'Copied from YouTube', spotifyToken);

      const trackUris: string[] = [];
      for (const song of comparisonResults.youtubeUnique) {
        const query = `${song.title} ${song.artist}`;
        const result = await searchSpotifyTrack(query, spotifyToken);
        if (result) {
          trackUris.push(result.uri);
        }
      }

      if (trackUris.length > 0) {
        await addItemsToSpotifyPlaylist(newPlaylist.id, trackUris, spotifyToken);
      }
      alert('Successfully copied to Spotify!');
    } catch (e: unknown) {
      console.error(e);
      setError(`Error copying to Spotify: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToYouTube = async () => {
    // Note: YouTube Data API v3 requires OAuth 2.0 for creating playlists, not just an API key.
    // Assuming youtubeApiKey is an OAuth token for this operation.
    if (!youtubeApiKey) {
      setError('YouTube OAuth Token is required to create playlists.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const newPlaylist = await createYouTubePlaylist('Copied from Spotify', youtubeApiKey);

      const videoIds: string[] = [];
      for (const song of comparisonResults.spotifyUnique) {
        const query = `${song.title} ${song.artist}`;
        const result = await searchYouTubeTrack(query, youtubeApiKey);
        if (result) {
          videoIds.push(result.id.videoId);
        }
      }

      if (videoIds.length > 0) {
        await addItemsToYouTubePlaylist(newPlaylist.id, videoIds, youtubeApiKey);
      }
      alert('Successfully copied to YouTube!');
    } catch (e: unknown) {
      console.error(e);
      setError(`Error copying to YouTube: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Playlist Comparison</h1>
        <InputField label="Spotify Playlist URL" value={spotifyUrl} onChange={(e) => setSpotifyUrl(e.target.value)} />
        <InputField label="Spotify Access Token" value={spotifyToken} onChange={(e) => setSpotifyToken(e.target.value)} />
        <InputField label="YouTube Music Playlist URL" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
        <InputField label="YouTube API Key" value={youtubeApiKey} onChange={(e) => setYoutubeApiKey(e.target.value)} />
        <div className="flex gap-4 mb-4">
          <Button label="Sync Playlists" onClick={handleSyncPlaylists} disabled={loading} />
          <Button label="Export to CSV" onClick={handleExportToCSV} disabled={loading || (!comparisonResults.spotifyUnique.length && !comparisonResults.youtubeUnique.length)} />
          <div>
            <input
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              id="csv-upload"
              onChange={handleImportCSV}
            />
            <label htmlFor="csv-upload">
              <Button label="Import CSV" onClick={() => document.getElementById('csv-upload')?.click()} disabled={loading} />
            </label>
          </div>
          <Button label="Copy to Spotify" onClick={handleCopyToSpotify} disabled={loading || !comparisonResults.youtubeUnique.length} />
          <Button label="Copy to YouTube" onClick={handleCopyToYouTube} disabled={loading || !comparisonResults.spotifyUnique.length} />
        </div>
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