"use client";

import Link from "next/link";
import React, { useState } from 'react';
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
import { showSuccess } from '@/utils/toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Music2,
  Youtube,
  ArrowRightLeft,
  Download,
  Upload,
  RefreshCcw,
  AlertCircle,
  LayoutGrid,
  Loader2,
  Info,
  Columns
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MadeWithRoboLab } from '@/components/made-with-robolab';
import { ThemeToggle } from '@/components/theme-toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const Index = () => {
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [spotifyToken, setSpotifyToken] = useState('');
  const [youtubeApiKey, setYoutubeApiKey] = useState('');
  const [spotifySongs, setSpotifySongs] = useState<any[]>([]);
  const [youtubeSongs, setYoutubeSongs] = useState<any[]>([]);
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult>({
    spotifyUnique: [],
    youtubeUnique: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'compare' | 'spotify' | 'youtube'>('compare');

  const handleSync = async () => {
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
      showSuccess('Playlists synchronized and compared successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to sync playlists. Check your URLs and credentials.');
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
    } finally {
      setLoading(false);
    }
  };

  return (
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
          </div>
          <div className="flex items-center gap-4">
            <MadeWithRoboLab />
            <ThemeToggle />
          </div>
        </div>
      </header>

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
                  </div>
                </div>
              </CardContent>
            </Card>

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
              </CardContent>
            </Card>
          </div>

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
                                    <div className="text-[10px] max-w-[200px] opacity-70">Enter a Spotify playlist URL and execute sync to populate data</div>
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
          </div>
        </div>
      </main>

      <footer className="border-t py-4 bg-muted/20">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
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
