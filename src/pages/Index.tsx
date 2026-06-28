/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
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
import { initiateOAuth, getAccessToken, logout as authLogout } from '@/utils/auth';
import InputField from '@/components/InputField';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
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
  AlertCircle,
  LogOut,
  ShieldCheck,
  Key
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Index = () => {
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [spotifyToken, setSpotifyToken] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeApiKey, setYoutubeApiKey] = useState('');

  const [authMode, setAuthMode] = useState<'manual' | 'oauth'>('oauth');
  const [isSpotifyAuthed, setIsSpotifyAuthed] = useState(false);
  const [isYouTubeAuthed, setIsYouTubeAuthed] = useState(false);

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

  useEffect(() => {
    const sToken = getAccessToken('spotify');
    const yToken = getAccessToken('google');
    setIsSpotifyAuthed(!!sToken);
    setIsYouTubeAuthed(!!yToken);
  }, []);

  const handleSyncPlaylists = async () => {
    if (!spotifyUrl || !youtubeUrl) {
      setError('Both Spotify and YouTube URLs are required.');
      return;
    }

    const sToken = authMode === 'oauth' ? getAccessToken('spotify') : spotifyToken;
    const yToken = authMode === 'oauth' ? getAccessToken('google') : youtubeApiKey;

    if (authMode === 'oauth') {
      if (!sToken) { setError('Please login to Spotify first.'); return; }
      if (!yToken) { setError('Please login to YouTube first.'); return; }
    }

    setLoading(true);
    setError('');
    try {
      // @ts-expect-error: OAuth tokens can be null if not authenticated
      const spotifyData = await getSpotifyPlaylist(spotifyUrl, sToken || '');
      // @ts-expect-error: OAuth tokens can be null if not authenticated
      const youtubeData = await getYouTubePlaylist(youtubeUrl, yToken || '');

      setSpotifySongs(spotifyData.tracks.items);
      setYoutubeSongs(youtubeData.items);

      const results = comparePlaylists(spotifyData.tracks.items, youtubeData.items);
      setComparisonResults(results);
      showSuccess('Playlists synchronized successfully!');
    } catch (error: any) {
      console.error('Sync error:', error);
      setError('An error occurred during sync. Please check your tokens and URLs.');
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
    const token = authMode === 'oauth' ? getAccessToken('spotify') : spotifyToken;
    if (!token) {
      setError('Spotify token is required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userId = await getSpotifyUserId(token);
      const newPlaylist = await createSpotifyPlaylist(userId, 'Copied from YouTube', token);

      const trackUris: string[] = [];
      for (const song of comparisonResults.youtubeUnique) {
        const query = `${song.title} ${song.artist}`;
        const result = await searchSpotifyTrack(query, token);
        if (result) trackUris.push(result.uri);
      }

      if (trackUris.length > 0) {
        await addItemsToSpotifyPlaylist(newPlaylist.id, trackUris, token);
      }
      showSuccess('Successfully copied to Spotify!');
    } catch (e: any) {
      setError('An error occurred while copying to Spotify.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToYouTube = async () => {
    const token = authMode === 'oauth' ? getAccessToken('google') : youtubeApiKey;
    if (!token) {
      setError('YouTube token is required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const newPlaylist = await createYouTubePlaylist('Copied from Spotify', token);

      const videoIds: string[] = [];
      for (const song of comparisonResults.spotifyUnique) {
        const query = `${song.title} ${song.artist}`;
        const result = await searchYouTubeTrack(query, token);
        if (result) videoIds.push(result.id.videoId);
      }

      if (videoIds.length > 0) {
        await addItemsToYouTubePlaylist(newPlaylist.id, videoIds, token);
      }
      showSuccess('Successfully copied to YouTube!');
    } catch (e: any) {
      setError('An error occurred while copying to YouTube.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: 'spotify' | 'google') => {
    initiateOAuth(provider).catch(err => {
      console.error('OAuth initiation error:', err);
      showError('Failed to start login process.');
    });
  };

  const handleLogout = (provider: 'spotify' | 'google') => {
    authLogout(provider);
    if (provider === 'spotify') setIsSpotifyAuthed(false);
    else setIsYouTubeAuthed(false);
    showSuccess(`Logged out from ${provider === 'spotify' ? 'Spotify' : 'YouTube'}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-primary selection:text-primary-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1">
              <RefreshCw className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold uppercase tracking-tighter text-lg hidden sm:inline-block">
              RoboLab Sync Tool
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2 bg-muted/50 px-3 py-1 border rounded-none">
              <Label htmlFor="auth-mode" className="text-[10px] uppercase font-bold tracking-widest cursor-pointer">
                {authMode === 'oauth' ? 'OAuth Mode' : 'Manual Mode'}
              </Label>
              <Switch
                id="auth-mode"
                checked={authMode === 'oauth'}
                onCheckedChange={(checked) => setAuthMode(checked ? 'oauth' : 'manual')}
              />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-none border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
              <CardHeader className="bg-primary/5 border-b py-4">
                <CardTitle className="text-xs uppercase flex items-center gap-2">
                  <Settings2 className="h-4 w-4" /> System Configuration
                </CardTitle>
                <CardDescription className="text-[10px] uppercase">Initialize sync parameters and auth tokens</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1 border-b">
                    <Music2 className="h-4 w-4 text-green-500" />
                    <h3 className="text-[11px] font-bold uppercase tracking-widest">Spotify Source</h3>
                  </div>
                  <InputField
                    label="Playlist URL"
                    placeholder="https://open.spotify.com/playlist/..."
                    value={spotifyUrl}
                    onChange={(e) => setSpotifyUrl(e.target.value)}
                  />
                  {authMode === 'manual' ? (
                    <InputField
                      label="Access Token"
                      type="password"
                      placeholder="Paste OAuth token here..."
                      value={spotifyToken}
                      onChange={(e) => setSpotifyToken(e.target.value)}
                    />
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Authentication</Label>
                      {isSpotifyAuthed ? (
                        <div className="flex items-center justify-between bg-muted/30 p-2 border border-dashed">
                          <div className="flex items-center gap-2 text-[10px] text-green-500 font-bold uppercase">
                            <ShieldCheck className="h-3 w-3" /> Authenticated
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleLogout('spotify')} className="h-6 text-[9px] uppercase px-2">
                            <LogOut className="h-3 w-3 mr-1" /> Logout
                          </Button>
                        </div>
                      ) : (
                        <Button variant="outline" className="w-full h-9 rounded-none border-2 text-[10px] uppercase font-bold" onClick={() => handleOAuthLogin('spotify')}>
                          <Key className="h-3 w-3 mr-2" /> Login with Spotify
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1 border-b">
                    <Youtube className="h-4 w-4 text-red-600" />
                    <h3 className="text-[11px] font-bold uppercase tracking-widest">YouTube Destination</h3>
                  </div>
                  <InputField
                    label="Playlist URL"
                    placeholder="https://www.youtube.com/playlist?list=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                  />
                  {authMode === 'manual' ? (
                    <InputField
                      label="API Key / Token"
                      type="password"
                      placeholder="Paste API key or OAuth token..."
                      value={youtubeApiKey}
                      onChange={(e) => setYoutubeApiKey(e.target.value)}
                    />
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Authentication</Label>
                      {isYouTubeAuthed ? (
                        <div className="flex items-center justify-between bg-muted/30 p-2 border border-dashed">
                          <div className="flex items-center gap-2 text-[10px] text-green-500 font-bold uppercase">
                            <ShieldCheck className="h-3 w-3" /> Authenticated
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleLogout('google')} className="h-6 text-[9px] uppercase px-2">
                            <LogOut className="h-3 w-3 mr-1" /> Logout
                          </Button>
                        </div>
                      ) : (
                        <Button variant="outline" className="w-full h-9 rounded-none border-2 text-[10px] uppercase font-bold" onClick={() => handleOAuthLogin('google')}>
                          <Key className="h-3 w-3 mr-2" /> Login with Google
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/50 text-red-500">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <p className="text-[10px] uppercase font-bold leading-tight">{error}</p>
                  </div>
                )}
                <Button
                  className="w-full h-12 rounded-none border-2 border-primary bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] text-xs uppercase font-bold tracking-widest"
                  onClick={handleSyncPlaylists}
                  disabled={loading}
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                  {loading ? 'Processing...' : 'Execute Sync'}
                </Button>
              </CardContent>
            </Card>
            <Card className="rounded-none border-2">
              <CardHeader className="bg-muted/50 border-b py-3">
                <CardTitle className="text-[10px] uppercase">Data Management</CardTitle>
              </CardHeader>
              <CardContent className="p-4 grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" className="rounded-none text-[10px] uppercase font-bold" onClick={handleExportToCSV} disabled={comparisonResults.matches.length === 0 && comparisonResults.spotifyUnique.length === 0}>
                  <Download className="h-3 w-3 mr-2" /> Export CSV
                </Button>
                <div className="relative">
                  <input type="file" accept=".csv" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleImportCSV} />
                  <Button variant="outline" size="sm" className="w-full rounded-none text-[10px] uppercase font-bold">
                    <Upload className="h-3 w-3 mr-2" /> Import CSV
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="rounded-none text-[10px] uppercase font-bold" onClick={handleCopyToSpotify} disabled={comparisonResults.youtubeUnique.length === 0}>
                  <Copy className="h-3 w-3 mr-2" /> To Spotify
                </Button>
                <Button variant="outline" size="sm" className="rounded-none text-[10px] uppercase font-bold" onClick={handleCopyToYouTube} disabled={comparisonResults.spotifyUnique.length === 0}>
                  <Copy className="h-3 w-3 mr-2" /> To YouTube
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-muted/50 p-1 border">
                <Button variant={viewMode === 'both' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('both')} className="rounded-none text-[10px] uppercase font-bold h-7">
                  <LayoutGrid className="h-3.5 w-3.5 mr-2" /> Side-by-Side
                </Button>
                <Button variant={viewMode === 'spotify' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('spotify')} className="rounded-none text-[10px] uppercase font-bold h-7">
                  <Music2 className="h-3.5 w-3.5 mr-2" /> Spotify Only
                </Button>
                <Button variant={viewMode === 'youtube' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('youtube')} className="rounded-none text-[10px] uppercase font-bold h-7">
                  <Youtube className="h-3.5 w-3.5 mr-2" /> YouTube Only
                </Button>
              </div>
            </div>
            <div className="relative">
              {viewMode === 'both' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="rounded-none border-2 flex flex-col h-[600px]">
                    <CardHeader className="bg-muted/50 border-b py-3 shrink-0">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs uppercase flex items-center gap-2">
                          <Music2 className="h-4 w-4 text-green-500" /> Spotify Source
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
                                      {isUnique ? <Badge className="bg-primary hover:bg-primary rounded-none text-[8px] h-4 px-1 uppercase">Unique</Badge> : <div className="h-1.5 w-1.5 rounded-full bg-border inline-block" />}
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
                                      {isUnique ? <Badge className="bg-primary hover:bg-primary rounded-none text-[8px] h-4 px-1 uppercase">Unique</Badge> : <div className="h-1.5 w-1.5 rounded-full bg-border inline-block" />}
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
            © 2024 RoboLab Sync Tool // Infrastructure Management
          </p>
          <div className="flex items-center gap-4">
            <a href="USAGE.md" className="text-[10px] uppercase font-bold hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm">Documentation</a>
            <a href="#" className="text-[10px] uppercase font-bold hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm">Privacy</a>
            <a href="#" className="text-[10px] uppercase font-bold hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm">API Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
