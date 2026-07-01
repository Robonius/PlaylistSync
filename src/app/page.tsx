<<<<<<< HEAD:src/app/page.tsx
"use client";

import Link from "next/link";
import React, { useState } from 'react';
=======
import { Link, useSearchParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
>>>>>>> main:src/pages/Index.tsx
import {
  getSpotifyUserId,
  createSpotifyPlaylist,
  searchSpotifyTrack,
  addItemsToSpotifyPlaylist,
  createYouTubePlaylist,
  searchYouTubeTrack,
  addItemsToYouTubePlaylist
} from '@/utils/api';
import { comparePlaylists, ComparisonResult } from '@/utils/playlistComparison';
import { exportToCSV } from '@/utils/csvExport';
import { importFromCSV } from '@/utils/csvImport';
import InputField from '@/components/InputField';
import { Button } from '@/components/ui/button';
<<<<<<< HEAD:src/app/page.tsx
import { showSuccess } from '@/utils/toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
=======
import { showSuccess, showError } from '@/utils/toast';
>>>>>>> main:src/pages/Index.tsx
import {
  Music2,
  Youtube,
  ArrowRightLeft,
  Download,
  Upload,
  RefreshCcw,
  AlertCircle,
  LayoutGrid,
<<<<<<< HEAD:src/app/page.tsx
  Loader2,
  Info,
  Columns
=======
  Columns,
  Search,
  Settings2,
  AlertCircle,
  LogIn,
  LogOut
>>>>>>> main:src/pages/Index.tsx
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
<<<<<<< HEAD:src/app/page.tsx
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MadeWithRoboLab } from '@/components/made-with-robolab';
import { ThemeToggle } from '@/components/theme-toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
=======
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getEnv } from '@/utils/env';
import {
  initiateSpotifyAuth,
  initiateGoogleAuth,
  exchangeSpotifyCodeForToken,
  exchangeGoogleCodeForToken
} from '@/utils/oauth';
>>>>>>> main:src/pages/Index.tsx

const Index = () => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [spotifyUrl, setSpotifyUrl] = useState('');
<<<<<<< HEAD:src/app/page.tsx
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [spotifyToken, setSpotifyToken] = useState('');
  const [youtubeApiKey, setYoutubeApiKey] = useState('');
=======
  const [spotifyToken, setSpotifyToken] = useState(localStorage.getItem('spotify_access_token') || '');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeApiKey, setYoutubeApiKey] = useState(localStorage.getItem('google_access_token') || '');
  const [useOAuth, setUseOAuth] = useState(true);

>>>>>>> main:src/pages/Index.tsx
  const [spotifySongs, setSpotifySongs] = useState<any[]>([]);
  const [youtubeSongs, setYoutubeSongs] = useState<any[]>([]);
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult>({
    spotifyUnique: [],
    youtubeUnique: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'compare' | 'spotify' | 'youtube'>('compare');

<<<<<<< HEAD:src/app/page.tsx
  const handleSync = async () => {
=======
  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (code) {
      const handleAuthCallback = async () => {
        setLoading(true);
        try {
          const redirectUri = getEnv('ROBOLAB_REDIRECT_URI', 'http://localhost:8080');

          if (localStorage.getItem('spotify_code_verifier')) {
            const storedState = localStorage.getItem('spotify_auth_state');
            localStorage.removeItem('spotify_auth_state');

            if (!state || state !== storedState) {
              throw new Error('CSRF validation failed');
            }

            const clientId = getEnv('ROBOLAB_SPOTIFY_CLIENT_ID');
            const data = await exchangeSpotifyCodeForToken(clientId, code, redirectUri);
            if (data.access_token) {
              setSpotifyToken(data.access_token);
              localStorage.setItem('spotify_access_token', data.access_token);
              localStorage.removeItem('spotify_code_verifier');
              showSuccess('Spotify Authenticated');
            }
          } else if (localStorage.getItem('google_code_verifier')) {
            const storedState = localStorage.getItem('google_auth_state');
            localStorage.removeItem('google_auth_state');

            if (!state || state !== storedState) {
              throw new Error('CSRF validation failed');
            }

            const clientId = getEnv('ROBOLAB_GOOGLE_CLIENT_ID');
            const data = await exchangeGoogleCodeForToken(clientId, code, redirectUri);
            if (data.access_token) {
              setYoutubeApiKey(data.access_token);
              localStorage.setItem('google_access_token', data.access_token);
              localStorage.removeItem('google_code_verifier');
              showSuccess('Google Authenticated');
            }
          }
        } catch (err) {
          showError('Authentication failed');
        } finally {
          setLoading(false);
          // Clear query params
          setSearchParams({});
        }
      };
      handleAuthCallback();
    }
  }, [searchParams, setSearchParams]);

  const handleSpotifyLogin = () => {
    const clientId = getEnv('ROBOLAB_SPOTIFY_CLIENT_ID');
    const redirectUri = getEnv('ROBOLAB_REDIRECT_URI', 'http://localhost:8080');
    if (!clientId) {
      showError('Spotify Client ID not configured');
      return;
    }
    initiateSpotifyAuth(clientId, redirectUri);
  };

  const handleGoogleLogin = () => {
    const clientId = getEnv('ROBOLAB_GOOGLE_CLIENT_ID');
    const redirectUri = getEnv('ROBOLAB_REDIRECT_URI', 'http://localhost:8080');
    if (!clientId) {
      showError('Google Client ID not configured');
      return;
    }
    initiateGoogleAuth(clientId, redirectUri);
  };

  const handleLogout = (platform: 'spotify' | 'google') => {
    if (platform === 'spotify') {
      setSpotifyToken('');
      localStorage.removeItem('spotify_access_token');
    } else {
      setYoutubeApiKey('');
      localStorage.removeItem('google_access_token');
    }
    showSuccess(`Logged out from ${platform}`);
  };

  const handleSyncPlaylists = async () => {
>>>>>>> main:src/pages/Index.tsx
    if (!spotifyUrl || !youtubeUrl) {
      setError('Please provide both Spotify and YouTube playlist URLs');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const spotifyData = await fetch(`/api/spotify?playlistId=${spotifyUrl}&token=${spotifyToken}`).then(res => res.json());
      const youtubeData = await fetch(`/api/youtube?playlistId=${youtubeUrl}&apiKey=${youtubeApiKey}`).then(res => res.json());

      if (spotifyData.error) throw new Error(spotifyData.error);
      if (youtubeData.error) throw new Error(youtubeData.error);

      const sSongs = spotifyData.tracks.items.map((item: any) => ({
        title: item.track.name,
        artist: item.track.artists[0].name,
        album: item.track.album.name,
        duration: item.track.duration_ms,
        platformId: item.track.id,
      }));

      const ySongs = youtubeData.items.map((item: any) => ({
        title: item.snippet.title,
        artist: item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle,
        album: 'N/A',
        duration: 0,
        platformId: item.snippet.resourceId.videoId,
      }));

      setSpotifySongs(sSongs);
      setYoutubeSongs(ySongs);

      const results = comparePlaylists(sSongs, ySongs);
      setComparisonResults(results);
<<<<<<< HEAD:src/app/page.tsx
      showSuccess('Playlists synchronized and compared successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to sync playlists. Check your URLs and credentials.');
=======
      showSuccess('Playlists synchronized successfully!');
    } catch (error: any) {
      setError('Sync failed. Ensure your tokens are valid and have sufficient permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToSpotify = async () => {
    if (!spotifyToken) {
      setError('Spotify authentication required.');
      return;
    }
    setLoading(true);
    try {
      const userId = await getSpotifyUserId(spotifyToken);
      const newPlaylist = await createSpotifyPlaylist(userId, 'Sync: YouTube to Spotify', spotifyToken);

      const trackUris: string[] = [];
      for (const song of comparisonResults.youtubeUnique) {
        const found = await searchSpotifyTrack(`${song.title} ${song.artist}`, spotifyToken);
        if (found) trackUris.push(found.uri);
      }

      if (trackUris.length > 0) {
        await addItemsToSpotifyPlaylist(newPlaylist.id, trackUris, spotifyToken);
        showSuccess(`Created Spotify playlist with ${trackUris.length} tracks!`);
      } else {
        showError('No matching tracks found on Spotify.');
      }
    } catch (err) {
      showError('Failed to copy to Spotify.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToYouTube = async () => {
    if (!youtubeApiKey) {
      setError('YouTube OAuth required.');
      return;
    }
    setLoading(true);
    try {
      const newPlaylist = await createYouTubePlaylist('Sync: Spotify to YouTube', youtubeApiKey);

      const videoIds: string[] = [];
      for (const song of comparisonResults.spotifyUnique) {
        const found = await searchYouTubeTrack(`${song.title} ${song.artist}`, youtubeApiKey);
        if (found) videoIds.push(found.id.videoId);
      }

      if (videoIds.length > 0) {
        await addItemsToYouTubePlaylist(newPlaylist.id, videoIds, youtubeApiKey);
        showSuccess(`Created YouTube playlist with ${videoIds.length} tracks!`);
      } else {
        showError('No matching tracks found on YouTube.');
      }
    } catch (err) {
      showError('Failed to copy to YouTube. Ensure you are using OAuth and not just an API key.');
>>>>>>> main:src/pages/Index.tsx
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const data = [
      ...spotifySongs.map(s => ({ ...s, platform: 'Spotify' })),
      ...youtubeSongs.map(y => ({ ...y, platform: 'YouTube' }))
    ];
    exportToCSV(data, 'playlist-comparison.csv');
    showSuccess('Data exported to CSV');
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
<<<<<<< HEAD:src/app/page.tsx
    if (file) {
      try {
        const data = await importFromCSV(file);
        const s = data.filter((item: any) => item.platform === 'Spotify');
        const y = data.filter((item: any) => item.platform === 'YouTube');
        setSpotifySongs(s);
        setYoutubeSongs(y);
        setComparisonResults(comparePlaylists(s, y));
        showSuccess('Data imported from CSV');
      } catch (err) {
        setError('Failed to import CSV file');
      }
    }
  };

  const handleSpotifyToYouTube = async () => {
    if (!youtubeApiKey) {
      setError('YouTube API key is required for this operation');
      return;
    }
    setLoading(true);
    try {
      const playlist = await createYouTubePlaylist('Synced from Spotify', youtubeApiKey);
      const videoIds: string[] = [];
      for (const song of comparisonResults.spotifyUnique) {
        const result = await searchYouTubeTrack(`${song.title} ${song.artist}`, youtubeApiKey);
        if (result && result.id && result.id.videoId) videoIds.push(result.id.videoId);
      }
      await addItemsToYouTubePlaylist(playlist.id, videoIds, youtubeApiKey);
      showSuccess(`Successfully transferred ${videoIds.length} tracks to YouTube`);
    } catch (err: any) {
      setError(err.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  const handleYouTubeToSpotify = async () => {
    if (!spotifyToken) {
      setError('Spotify token is required for this operation');
      return;
    }
    setLoading(true);
    try {
      const userId = await getSpotifyUserId(spotifyToken);
      const playlist = await createSpotifyPlaylist(userId, 'Synced from YouTube', spotifyToken);
      const trackUris: string[] = [];
      for (const song of comparisonResults.youtubeUnique) {
        const result = await searchSpotifyTrack(`${song.title} ${song.artist}`, spotifyToken);
        if (result && result.uri) trackUris.push(result.uri);
      }
      await addItemsToSpotifyPlaylist(playlist.id, trackUris, spotifyToken);
      showSuccess(`Successfully transferred ${trackUris.length} tracks to Spotify`);
    } catch (err: any) {
      setError(err.message || 'Transfer failed');
=======
    if (!file) return;

    setLoading(true);
    try {
      const data = await importFromCSV(file);
      // Logic for handling CSV data
      showSuccess('CSV imported successfully!');
    } catch (err) {
      showError('Failed to import CSV.');
>>>>>>> main:src/pages/Index.tsx
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD:src/app/page.tsx
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b-2 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2">
              <RefreshCcw className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tighter uppercase italic">RoboLab</h1>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-60">Playlist Comparison Module</p>
            </div>
=======
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-primary selection:text-primary-foreground">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1">
              <RefreshCw className={`h-5 w-5 text-primary-foreground ${loading ? 'animate-spin' : ''}`} />
            </div>
            <span className="text-xl font-bold uppercase tracking-tighter italic">RoboLab // Sync</span>
>>>>>>> main:src/pages/Index.tsx
          </div>
          <div className="flex items-center gap-4">
            <MadeWithRoboLab />
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="rounded-none border-2 h-9 w-9" aria-label="Settings">
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

<<<<<<< HEAD:src/app/page.tsx
      <main className="flex-grow container py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-none border-2 shadow-none">
              <CardHeader className="bg-muted/50 border-b py-3">
                <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" /> System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-bold uppercase text-primary flex items-center gap-2">
                      <Music2 className="h-3 w-3" /> Spotify Source
                    </h3>
                    <InputField
                      label="Playlist ID"
                      placeholder="e.g. 37i9dQZF1DXcBWIGoYBM3M"
                      value={spotifyUrl}
                      onChange={(e) => setSpotifyUrl(e.target.value)}
                    />
                    <InputField
                      label="OAuth Token (Optional)"
                      type="password"
                      placeholder="Your Spotify access token"
                      value={spotifyToken}
                      onChange={(e) => setSpotifyToken(e.target.value)}
                    />
                  </div>

                  <div className="pt-4 space-y-2 border-t border-dashed">
                    <h3 className="text-[10px] font-bold uppercase text-red-600 flex items-center gap-2">
                      <Youtube className="h-3 w-3" /> YouTube Destination
                    </h3>
                    <InputField
                      label="Playlist ID"
                      placeholder="e.g. PLu5v7v8z2w3N5M..."
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                    />
                    <InputField
                      label="API Key (Optional)"
                      type="password"
                      placeholder="Your YouTube API Key"
                      value={youtubeApiKey}
                      onChange={(e) => setYoutubeApiKey(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button
                    onClick={handleSync}
                    disabled={loading}
                    className="w-full rounded-none font-bold uppercase italic text-xs h-10 group"
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />}
                    Execute Synchronization
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={handleExport} className="rounded-none text-[10px] uppercase font-bold h-9">
                      <Download className="mr-2 h-3 w-3" /> Export CSV
                    </Button>
                    <div className="relative">
                      <Button variant="outline" className="rounded-none text-[10px] uppercase font-bold h-9 w-full">
                        <Upload className="mr-2 h-3 w-3" /> Import CSV
                      </Button>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleImport}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
=======
      <main className="container py-8 px-4 max-w-7xl mx-auto space-y-8">
        <div className="grid lg:grid-cols-[350px_1fr] gap-8">
          {/* Controls Sidebar */}
          <div className="space-y-6">
            <Card className="rounded-none border-2">
              <CardHeader className="bg-muted/50 border-b py-3">
                <CardTitle className="text-xs uppercase flex items-center gap-2">
                  <Settings2 className="h-4 w-4" /> Auth & Sources
                </CardTitle>
                <CardDescription className="text-[10px] uppercase">Configure platform identity and access</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between space-x-2 pb-2">
                  <Label htmlFor="oauth-mode" className="text-[10px] uppercase font-bold">Use OAuth Login</Label>
                  <Switch id="oauth-mode" checked={useOAuth} onCheckedChange={setUseOAuth} />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Music2 className="h-3 w-3 text-[#1DB954]" />
                      <span className="text-[10px] uppercase font-bold">Spotify Source</span>
                    </div>
                    <InputField
                      label="Playlist ID or URL"
                      value={spotifyUrl}
                      onChange={(e) => setSpotifyUrl(e.target.value)}
                      placeholder="Spotify URL..."
                    />
                    {useOAuth ? (
                      <div className="flex gap-2">
                        {spotifyToken ? (
                          <Button variant="outline" size="sm" className="w-full text-[10px] uppercase h-8 rounded-none border-2" onClick={() => handleLogout('spotify')}>
                            <LogOut className="h-3 w-3 mr-2" /> Logout Spotify
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="w-full text-[10px] uppercase h-8 rounded-none border-2 bg-[#1DB954]/10 border-[#1DB954]/50 hover:bg-[#1DB954]/20" onClick={handleSpotifyLogin}>
                            <LogIn className="h-3 w-3 mr-2" /> Login Spotify
                          </Button>
                        )}
                      </div>
                    ) : (
                      <InputField
                        label="Spotify Token"
                        value={spotifyToken}
                        onChange={(e) => setSpotifyToken(e.target.value)}
                        type="password"
                        placeholder="OAuth Token..."
                      />
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Youtube className="h-3 w-3 text-red-500" />
                      <span className="text-[10px] uppercase font-bold">YouTube Destination</span>
                    </div>
                    <InputField
                      label="Playlist ID or URL"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="YouTube URL..."
                    />
                    {useOAuth ? (
                      <div className="flex gap-2">
                        {youtubeApiKey ? (
                          <Button variant="outline" size="sm" className="w-full text-[10px] uppercase h-8 rounded-none border-2" onClick={() => handleLogout('google')}>
                            <LogOut className="h-3 w-3 mr-2" /> Logout Google
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="w-full text-[10px] uppercase h-8 rounded-none border-2 bg-red-500/10 border-red-500/50 hover:bg-red-500/20" onClick={handleGoogleLogin}>
                            <LogIn className="h-3 w-3 mr-2" /> Login Google
                          </Button>
                        )}
                      </div>
                    ) : (
                      <InputField
                        label="YouTube API Key"
                        value={youtubeApiKey}
                        onChange={(e) => setYoutubeApiKey(e.target.value)}
                        type="password"
                        placeholder="API Key..."
                      />
                    )}
                  </div>
                </div>

                <Button
                  className="w-full rounded-none uppercase font-bold tracking-widest mt-4"
                  disabled={loading}
                  onClick={handleSyncPlaylists}
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                  Execute Sync
                </Button>

                {error && (
                  <div
                    className="p-3 bg-destructive/10 border border-destructive flex gap-2 items-start mt-4"
                    role="alert"
                    aria-live="assertive"
                  >
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-[10px] text-destructive leading-tight uppercase font-bold">{error}</p>
>>>>>>> main:src/pages/Index.tsx
                  </div>
                </div>
              </CardContent>
            </Card>

<<<<<<< HEAD:src/app/page.tsx
            {error && (
              <Alert variant="destructive" className="rounded-none border-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-xs uppercase font-bold">System Error</AlertTitle>
                <AlertDescription className="text-[10px] leading-relaxed">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Card className="rounded-none border-2 shadow-none bg-muted/20">
              <CardHeader className="py-3 border-b">
                <CardTitle className="text-xs uppercase flex items-center gap-2">
                  <Info className="h-4 w-4" /> Operations Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-[10px] leading-relaxed space-y-2 uppercase opacity-70">
                <p>1. Input Source and Destination Playlist IDs.</p>
                <p>2. Provide platform credentials if required for private playlists.</p>
                <p>3. Execution will map data across platforms and identify missing fragments.</p>
=======
            <Card className="rounded-none border-2 bg-muted/20">
              <CardHeader className="py-3 border-b">
                <CardTitle className="text-xs uppercase">Utilities</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="rounded-none text-[10px] uppercase border-2 h-10" onClick={handleExportToCSV}>
                    <Download className="h-3 w-3 mr-2" /> Export
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".csv"
                      onChange={handleImportCSV}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-none text-[10px] uppercase border-2 h-10"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-3 w-3 mr-2" /> Import
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 pt-2">
                  <Button variant="secondary" size="sm" className="rounded-none text-[10px] uppercase border-2 h-10" onClick={handleCopyToSpotify} disabled={loading}>
                    <Copy className="h-3 w-3 mr-2" /> Copy Unique to Spotify
                  </Button>
                  <Button variant="secondary" size="sm" className="rounded-none text-[10px] uppercase border-2 h-10" onClick={handleCopyToYouTube} disabled={loading}>
                    <Copy className="h-3 w-3 mr-2" /> Copy Unique to YouTube
                  </Button>
                </div>
>>>>>>> main:src/pages/Index.tsx
              </CardContent>
            </Card>
          </div>

<<<<<<< HEAD:src/app/page.tsx
          <div className="lg:col-span-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)} className="w-full">
                <div className="flex items-center justify-between">
                  <TabsList className="rounded-none border-2 h-10 p-1 bg-card">
                    <TabsTrigger value="compare" className="rounded-none text-[10px] uppercase font-bold data-[state=active]:bg-primary data-[state=active]:text-white h-full px-4">
                      <ArrowRightLeft className="mr-2 h-3 w-3" /> Comparison
                    </TabsTrigger>
                    <TabsTrigger value="spotify" className="rounded-none text-[10px] uppercase font-bold data-[state=active]:bg-primary data-[state=active]:text-white h-full px-4">
                      <Music2 className="mr-2 h-3 w-3" /> Spotify
                    </TabsTrigger>
                    <TabsTrigger value="youtube" className="rounded-none text-[10px] uppercase font-bold data-[state=active]:bg-primary data-[state=active]:text-white h-full px-4">
                      <Youtube className="mr-2 h-3 w-3" /> YouTube
                    </TabsTrigger>
                  </TabsList>

                  {viewMode === 'compare' && (spotifySongs.length > 0 || youtubeSongs.length > 0) && (
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-none border-2 h-10 text-[9px] uppercase font-bold"
                            onClick={handleSpotifyToYouTube}
                            disabled={comparisonResults.spotifyUnique.length === 0 || loading}
                          >
                            Push Unique to YT
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="rounded-none text-[10px] uppercase">
                          Transfer tracks found only on Spotify to YouTube
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-none border-2 h-10 text-[9px] uppercase font-bold"
                            onClick={handleYouTubeToSpotify}
                            disabled={comparisonResults.youtubeUnique.length === 0 || loading}
                          >
                            Push Unique to Spotify
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="rounded-none text-[10px] uppercase">
                          Transfer tracks found only on YouTube to Spotify
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                </div>
              </Tabs>
            </div>

            <div className="flex-grow">
              {viewMode === 'compare' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  <Card className="rounded-none border-2 flex flex-col h-[600px]">
                    <CardHeader className="bg-muted/50 border-b py-3 shrink-0">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs uppercase flex items-center gap-2">
                          <Music2 className="h-4 w-4 text-green-600 dark:text-green-500" /> Spotify Source
                        </CardTitle>
                        <Badge variant="secondary" className="rounded-none text-[10px]">{comparisonResults.spotifyUnique.length} Unique</Badge>
                      </div>
=======
          {/* Results Area */}
          <div className="space-y-6">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <TabsList className="bg-transparent h-auto p-0 gap-4">
                  <TabsTrigger value="both" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent uppercase text-[11px] font-bold px-0 pb-2">Full Comparison</TabsTrigger>
                  <TabsTrigger value="spotify" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent uppercase text-[11px] font-bold px-0 pb-2">Spotify Only</TabsTrigger>
                  <TabsTrigger value="youtube" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent uppercase text-[11px] font-bold px-0 pb-2">YouTube Only</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="rounded-none text-[10px] border-2 uppercase">{comparisonResults.matches.length} Matches</Badge>
                </div>
              </div>

              <div className="min-h-[500px]">
                {viewMode === 'both' ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Spotify Pane */}
                    <Card className="rounded-none border-2 flex flex-col h-[600px]">
                      <CardHeader className="bg-muted/50 border-b py-3 shrink-0">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xs uppercase flex items-center gap-2">
                            <Music2 className="h-4 w-4 text-[#1DB954]" /> Spotify Source
                          </CardTitle>
                          <Badge variant="secondary" className="rounded-none text-[10px]">{comparisonResults.spotifyUnique.length} Unique</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0 overflow-hidden flex-grow">
                        <ScrollArea className="h-full">
                          <Table>
                            <TableHeader className="bg-background sticky top-0 z-10">
                              <TableRow className="hover:bg-transparent border-b">
                                <TableHead className="text-[10px] uppercase font-bold h-8">Title</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold h-8">Artist</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold h-8 text-right px-4">Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {spotifySongs.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={3} className="text-center py-20">
                                    <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                                      <Music2 className="h-8 w-8 opacity-20" aria-hidden="true" />
                                      <div className="uppercase text-[10px] font-bold">No source data loaded</div>
                                      <div className="text-[10px] max-w-[200px] opacity-70">Enter a Spotify playlist URL and execute sync</div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ) : (
                                spotifySongs.map((song, i) => {
                                  const isUnique = comparisonResults.spotifyUnique.some(s => s.platformId === song.platformId);
                                  return (
                                    <TableRow key={i} className="group border-b last:border-0">
                                      <TableCell className="py-2 text-[11px] font-medium leading-tight max-w-[200px] truncate">{song.title}</TableCell>
                                      <TableCell className="py-2 text-[10px] text-muted-foreground uppercase truncate">{song.artist}</TableCell>
                                      <TableCell className="py-2 text-right px-4">
                                        {isUnique ? (
                                          <Badge className="bg-primary hover:bg-primary rounded-none text-[8px] h-4 px-1 uppercase">Unique</Badge>
                                        ) : (
                                          <div className="h-1.5 w-1.5 rounded-full bg-border inline-block" />
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })
                              )}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      </CardContent>
                    </Card>

                    {/* YouTube Pane */}
                    <Card className="rounded-none border-2 flex flex-col h-[600px]">
                      <CardHeader className="bg-muted/50 border-b py-3 shrink-0">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xs uppercase flex items-center gap-2">
                            <Youtube className="h-4 w-4 text-red-600 dark:text-red-500" /> YouTube Destination
                          </CardTitle>
                          <Badge variant="secondary" className="rounded-none text-[10px]">{comparisonResults.youtubeUnique.length} Unique</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0 overflow-hidden flex-grow">
                        <ScrollArea className="h-full">
                          <Table>
                            <TableHeader className="bg-background sticky top-0 z-10">
                              <TableRow className="hover:bg-transparent border-b">
                                <TableHead className="text-[10px] uppercase font-bold h-8">Title</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold h-8">Artist</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold h-8 text-right px-4">Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {youtubeSongs.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={3} className="text-center py-20">
                                    <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                                      <Youtube className="h-8 w-8 opacity-20" aria-hidden="true" />
                                      <div className="uppercase text-[10px] font-bold">No destination data loaded</div>
                                      <div className="text-[10px] max-w-[200px] opacity-70">Enter a YouTube playlist URL and execute sync</div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ) : (
                                youtubeSongs.map((song, i) => {
                                  const isUnique = comparisonResults.youtubeUnique.some(s => s.platformId === song.platformId);
                                  return (
                                    <TableRow key={i} className="group border-b last:border-0">
                                      <TableCell className="py-2 text-[11px] font-medium leading-tight max-w-[200px] truncate">{song.title}</TableCell>
                                      <TableCell className="py-2 text-[10px] text-muted-foreground uppercase truncate">{song.artist}</TableCell>
                                      <TableCell className="py-2 text-right px-4">
                                        {isUnique ? (
                                          <Badge className="bg-primary hover:bg-primary rounded-none text-[8px] h-4 px-1 uppercase">Unique</Badge>
                                        ) : (
                                          <div className="h-1.5 w-1.5 rounded-full bg-border inline-block" />
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })
                              )}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card className="rounded-none border-2 flex flex-col h-[600px]">
                    <CardHeader className="bg-muted/50 border-b py-3 shrink-0">
                      <CardTitle className="text-xs uppercase flex items-center gap-2">
                        <Columns className="h-4 w-4 text-primary" />
                        {viewMode === 'spotify' ? 'Spotify Catalog' : 'YouTube Catalog'}
                      </CardTitle>
>>>>>>> main:src/pages/Index.tsx
                    </CardHeader>
                    <CardContent className="p-0 overflow-hidden flex-grow">
                      <ScrollArea className="h-full">
                        <Table>
                          <TableHeader className="bg-background sticky top-0 z-10">
                            <TableRow className="hover:bg-transparent border-b">
                              <TableHead className="text-[10px] uppercase font-bold h-8">Title</TableHead>
                              <TableHead className="text-[10px] uppercase font-bold h-8">Artist</TableHead>
                              <TableHead className="text-[10px] uppercase font-bold h-8">Album</TableHead>
                              <TableHead className="text-[10px] uppercase font-bold h-8 text-right px-4">ID</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(viewMode === 'spotify' ? spotifySongs : youtubeSongs).map((song, i) => (
                              <TableRow key={i} className="group border-b last:border-0">
                                <TableCell className="py-2 text-[11px] font-medium leading-tight">{song.title}</TableCell>
                                <TableCell className="py-2 text-[10px] text-muted-foreground uppercase">{song.artist}</TableCell>
                                <TableCell className="py-2 text-[10px] text-muted-foreground uppercase">{song.album}</TableCell>
                                <TableCell className="py-2 text-[9px] text-right font-mono text-muted-foreground/50 px-4">{song.platformId}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </CardContent>
                  </Card>
<<<<<<< HEAD:src/app/page.tsx

                  <Card className="rounded-none border-2 flex flex-col h-[600px]">
                    <CardHeader className="bg-muted/50 border-b py-3 shrink-0">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs uppercase flex items-center gap-2">
                          <Youtube className="h-4 w-4 text-red-600 dark:text-red-500" /> YouTube Destination
                        </CardTitle>
                        <Badge variant="secondary" className="rounded-none text-[10px]">{comparisonResults.youtubeUnique.length} Unique</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 overflow-hidden flex-grow">
                      <ScrollArea className="h-full">
                        <Table>
                          <TableHeader className="bg-background sticky top-0 z-10">
                            <TableRow className="hover:bg-transparent border-b">
                              <TableHead className="text-[10px] uppercase font-bold h-8">Title</TableHead>
                              <TableHead className="text-[10px] uppercase font-bold h-8">Artist</TableHead>
                              <TableHead className="text-[10px] uppercase font-bold h-8 text-right px-4">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {youtubeSongs.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={3} className="text-center py-20">
                                  <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                                    <Youtube className="h-8 w-8 opacity-20" aria-hidden="true" />
                                    <div className="uppercase text-[10px] font-bold">No destination data loaded</div>
                                    <div className="text-[10px] max-w-[200px] opacity-70">Enter a YouTube playlist URL and execute sync to populate data</div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : (
                              youtubeSongs.map((song, i) => {
                                const isUnique = comparisonResults.youtubeUnique.some(s => s.platformId === song.platformId);
                                return (
                                  <TableRow key={i} className="group border-b last:border-0">
                                    <TableCell className="py-2 text-[11px] font-medium leading-tight max-w-[200px] truncate">{song.title}</TableCell>
                                    <TableCell className="py-2 text-[10px] text-muted-foreground uppercase truncate">{song.artist}</TableCell>
                                    <TableCell className="py-2 text-right px-4">
                                      {isUnique ? (
                                        <Badge className="bg-primary hover:bg-primary rounded-none text-[8px] h-4 px-1 uppercase">Unique</Badge>
                                      ) : (
                                        <div className="h-1.5 w-1.5 rounded-full bg-border inline-block" />
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                            )}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="rounded-none border-2 flex flex-col h-[600px]">
                  <CardHeader className="bg-muted/50 border-b py-3 shrink-0">
                    <CardTitle className="text-xs uppercase flex items-center gap-2">
                      <Columns className="h-4 w-4 text-primary" />
                      {viewMode === 'spotify' ? 'Spotify Catalog' : 'YouTube Catalog'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 overflow-hidden flex-grow">
                    <ScrollArea className="h-full">
                      <Table>
                        <TableHeader className="bg-background sticky top-0 z-10">
                          <TableRow className="hover:bg-transparent border-b">
                            <TableHead className="text-[10px] uppercase font-bold h-8">Title</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold h-8">Artist</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold h-8">Album</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold h-8 text-right px-4">ID</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(viewMode === 'spotify' ? spotifySongs : youtubeSongs).map((song, i) => (
                            <TableRow key={i} className="group border-b last:border-0">
                              <TableCell className="py-2 text-[11px] font-medium leading-tight">{song.title}</TableCell>
                              <TableCell className="py-2 text-[10px] text-muted-foreground uppercase">{song.artist}</TableCell>
                              <TableCell className="py-2 text-[10px] text-muted-foreground uppercase">{song.album}</TableCell>
                              <TableCell className="py-2 text-[9px] text-right font-mono text-muted-foreground/50 px-4">{song.platformId}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </div>
=======
                )}
              </div>
            </Tabs>
>>>>>>> main:src/pages/Index.tsx
          </div>
        </div>
      </main>

      <footer className="border-t py-4 bg-muted/20">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4 mx-auto">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            © 2026 RoboLab Systems // Playlist Synchronization Module
          </p>
          <div className="flex items-center gap-4">
            <Link href="/documentation" className="text-[10px] uppercase font-bold hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm">Documentation</Link>
            <Link href="/privacy" className="text-[10px] uppercase font-bold hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm">Privacy</Link>
            <Link href="/api-status" className="text-[10px] uppercase font-bold hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm">API Status</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
