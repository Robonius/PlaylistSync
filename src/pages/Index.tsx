import { Link, useSearchParams } from 'react-router-dom';
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
  LogIn,
  LogOut
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
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

const Index = () => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [spotifyToken, setSpotifyToken] = useState(localStorage.getItem('spotify_access_token') || '');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeApiKey, setYoutubeApiKey] = useState(localStorage.getItem('google_access_token') || '');
  const [useOAuth, setUseOAuth] = useState(true);

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
      // Logic for handling CSV data
      showSuccess('CSV imported successfully!');
    } catch (err) {
      showError('Failed to import CSV.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-primary selection:text-primary-foreground">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1">
              <RefreshCw className={`h-5 w-5 text-primary-foreground ${loading ? 'animate-spin' : ''}`} />
            </div>
            <span className="text-xl font-bold uppercase tracking-tighter italic">RoboLab // Sync</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="rounded-none border-2 h-9 w-9" aria-label="Settings">
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

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
                  </div>
                )}
              </CardContent>
            </Card>

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
              </CardContent>
            </Card>
          </div>

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
            </Tabs>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 bg-muted/20">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4 mx-auto">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            © 2026 RoboLab Systems // Playlist Synchronization Module
          </p>
          <div className="flex items-center gap-4">
            <Link to="/documentation" className="text-[10px] uppercase font-bold hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm">Documentation</Link>
            <Link to="/privacy" className="text-[10px] uppercase font-bold hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm">Privacy</Link>
            <Link to="/api-status" className="text-[10px] uppercase font-bold hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm">API Status</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
