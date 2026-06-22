import React, { useState } from 'react';
import {
  getSpotifyPlaylist,
  getYouTubePlaylist,
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
import {
  Music2,
  Youtube,
  RefreshCw,
  Download,
  Upload,
  Copy,
  LayoutGrid,
  Columns,
  Search,
  Settings2,
  AlertCircle
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [spotifyToken, setSpotifyToken] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeApiKey, setYoutubeApiKey] = useState('');
  const [spotifySongs, setSpotifySongs] = useState<any[]>([]);
  const [youtubeSongs, setYoutubeSongs] = useState<any[]>([]);
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult>({
    spotifyUnique: [],
    youtubeUnique: [],
    matches: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'spotify' | 'youtube' | 'both'>('both');

  const handleSyncPlaylists = async () => {
    if (!spotifyUrl || !youtubeUrl) {
      setError('Both Spotify and YouTube URLs are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const spotifyData = await getSpotifyPlaylist(spotifyUrl, spotifyToken);
      const youtubeData = await getYouTubePlaylist(youtubeUrl, youtubeApiKey);

      setSpotifySongs(spotifyData);
      setYoutubeSongs(youtubeData);

      const results = comparePlaylists(spotifyData, youtubeData);
      setComparisonResults(results);
      showSuccess('Playlists synchronized successfully!');
    } catch (error: any) {
      if (error.response) {
        setError('An error occurred with the API request. Please check your inputs and try again.');
      } else if (error.request) {
        setError('No response received from the server. Please try again later.');
      } else {
        setError('An unexpected error occurred during sync. Please try again.');
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
          importedSpotify.push(song);
          importedYouTube.push(song);
        }
      });

      setSpotifySongs(importedSpotify);
      setYoutubeSongs(importedYouTube);
      setComparisonResults(comparePlaylists(importedSpotify, importedYouTube));
      showSuccess('Successfully imported CSV!');
    } catch (e: any) {
      setError('An error occurred while importing the CSV file.');
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  const handleCopyToSpotify = async () => {
    if (!spotifyToken) {
      setError('Spotify Access Token is required.');
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
        if (result) trackUris.push(result.uri);
      }

      if (trackUris.length > 0) {
        await addItemsToSpotifyPlaylist(newPlaylist.id, trackUris, spotifyToken);
      }
      showSuccess('Successfully copied to Spotify!');
    } catch (e: any) {
      setError('An error occurred while copying to Spotify.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToYouTube = async () => {
    if (!youtubeApiKey) {
      setError('YouTube OAuth Token is required.');
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
        if (result) videoIds.push(result.id.videoId);
      }

      if (videoIds.length > 0) {
        await addItemsToYouTubePlaylist(newPlaylist.id, videoIds, youtubeApiKey);
      }
      showSuccess('Successfully copied to YouTube!');
    } catch (e: any) {
      setError('An error occurred while copying to YouTube.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-primary selection:text-primary-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1">
              <RefreshCw className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold uppercase tracking-tighter">Dyad // Sync</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar / Configuration */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-none border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2">
                  <Settings2 className="h-4 w-4" /> Configuration
                </CardTitle>
                <CardDescription className="text-[10px] uppercase">Setup API access and targets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-3 border bg-muted/50">
                    <div className="flex items-center gap-2 mb-3 text-primary">
                      <Music2 className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase">Spotify Endpoint</span>
                    </div>
                    <InputField label="Playlist URL" value={spotifyUrl} onChange={(e) => setSpotifyUrl(e.target.value)} />
                    <InputField label="Access Token" value={spotifyToken} onChange={(e) => setSpotifyToken(e.target.value)} type="password" />
                  </div>

                  <div className="p-3 border bg-muted/50">
                    <div className="flex items-center gap-2 mb-3 text-red-600 dark:text-red-500">
                      <Youtube className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase">YouTube Endpoint</span>
                    </div>
                    <InputField label="Playlist URL" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
                    <InputField label="OAuth Token" value={youtubeApiKey} onChange={(e) => setYoutubeApiKey(e.target.value)} type="password" />
                  </div>
                </div>

                <Button
                  onClick={handleSyncPlaylists}
                  disabled={loading}
                  className="w-full rounded-none h-12 uppercase text-xs font-bold tracking-widest gap-2 bg-primary hover:bg-primary/90"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Processing...' : 'Execute Sync'}
                </Button>

                {error && (
                  <div className="p-3 border-l-2 border-primary bg-primary/5 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-[10px] uppercase text-primary font-bold">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-none border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" /> Operations
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  onClick={handleExportToCSV}
                  disabled={loading || (!comparisonResults.spotifyUnique.length && !comparisonResults.youtubeUnique.length)}
                  className="rounded-none uppercase text-[10px] justify-start gap-2"
                >
                  <Download className="h-3 w-3" /> Export Results
                </Button>

                <div className="relative">
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    id="csv-upload"
                    onChange={handleImportCSV}
                  />
                  <label htmlFor="csv-upload" className="w-full">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('csv-upload')?.click()}
                      disabled={loading}
                      className="rounded-none uppercase text-[10px] justify-start gap-2 w-full"
                    >
                      <Upload className="h-3 w-3" /> Import CSV Data
                    </Button>
                  </label>
                </div>

                <Separator className="my-2" />

                <Button
                  variant="secondary"
                  onClick={handleCopyToSpotify}
                  disabled={loading || !comparisonResults.youtubeUnique.length}
                  className="rounded-none uppercase text-[10px] justify-start gap-2"
                >
                  <Copy className="h-3 w-3" /> Transfer to Spotify
                </Button>

                <Button
                  variant="secondary"
                  onClick={handleCopyToYouTube}
                  disabled={loading || !comparisonResults.spotifyUnique.length}
                  className="rounded-none uppercase text-[10px] justify-start gap-2"
                >
                  <Copy className="h-3 w-3" /> Transfer to YouTube
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Area / Results */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-bold uppercase tracking-tighter">Comparison Matrix</h2>
                <div className="flex gap-2">
                  <Badge variant="outline" className="rounded-none text-[10px] uppercase font-mono">
                    Spotify: {spotifySongs.length} tracks
                  </Badge>
                  <Badge variant="outline" className="rounded-none text-[10px] uppercase font-mono">
                    YouTube: {youtubeSongs.length} tracks
                  </Badge>
                  <Badge className="rounded-none text-[10px] uppercase font-mono bg-primary">
                    Diff: {comparisonResults.spotifyUnique.length + comparisonResults.youtubeUnique.length} tracks
                  </Badge>
                </div>
              </div>

              <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)} className="hidden md:block">
                <TabsList className="rounded-none border-2 h-9 p-0 bg-background">
                  <TabsTrigger value="spotify" className="rounded-none px-4 text-[10px] uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Spotify</TabsTrigger>
                  <TabsTrigger value="youtube" className="rounded-none px-4 text-[10px] uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">YouTube</TabsTrigger>
                  <TabsTrigger value="both" className="rounded-none px-4 text-[10px] uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Dual View</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {viewMode === 'both' ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Spotify Pane */}
                  <Card className="rounded-none border-2 flex flex-col h-[600px]">
                    <CardHeader className="bg-muted/50 border-b py-3 shrink-0">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs uppercase flex items-center gap-2">
                          <Music2 className="h-4 w-4 text-primary" /> Spotify Source
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
                                <TableCell colSpan={3} className="text-center py-20 text-muted-foreground uppercase text-[10px]">No source data loaded</TableCell>
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
                                <TableCell colSpan={3} className="text-center py-20 text-muted-foreground uppercase text-[10px]">No destination data loaded</TableCell>
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

      {/* Footer */}
      <footer className="border-t py-4 bg-muted/20">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            © 2024 Dyad Industrial Systems // Playlist Synchronization Module
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[10px] uppercase font-bold hover:text-primary transition-colors">Documentation</a>
            <a href="#" className="text-[10px] uppercase font-bold hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-[10px] uppercase font-bold hover:text-primary transition-colors">API Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
