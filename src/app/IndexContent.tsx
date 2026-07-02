"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from 'react';
import {
  getSpotifyPlaylist,
  getYouTubePlaylist,
  createYouTubePlaylist,
  searchYouTubeTrack,
  addItemsToYouTubePlaylist,
  checkAuthStatus
} from '@/utils/api';
import { comparePlaylists, ComparisonResult } from '@/utils/playlistComparison';
import { exportToCSV } from '@/utils/csvExport';
import { importFromCSV } from '@/utils/csvImport';
import InputField from '@/components/InputField';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Music2,
  Youtube,
  Search,
  RefreshCcw,
  ArrowRightLeft,
  Columns,
  Download,
  Upload,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Monitor,
  Database,
  Lock
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { initiateSpotifyAuth, initiateGoogleAuth } from '@/utils/oauth';
import { useRuntimeConfig } from '@/components/runtime-config-provider';

export default function IndexContent() {
  const searchParams = useSearchParams();
  const runtimeConfig = useRuntimeConfig();
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'comparison' | 'spotify' | 'youtube'>('comparison');
  const [authStatus, setAuthStatus] = useState({ spotify: false, youtube: false });
  const [spotifySongs, setSpotifySongs] = useState<any[]>([]);
  const [youtubeSongs, setYoutubeSongs] = useState<any[]>([]);
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult>({
    common: [],
    spotifyUnique: [],
    youtubeUnique: [],
    totalTracks: 0
  });

  const [activeTab, setActiveTab] = useState('sync');

  useEffect(() => {
    const fetchStatus = async () => {
      const status = await checkAuthStatus();
      setAuthStatus(status);
    };
    fetchStatus();

    const error = searchParams.get('error');
    if (error) {
      showError('Authentication failed: ' + error);
      window.history.replaceState({}, document.title, "/");
    }
  }, [searchParams]);

  const handleSpotifyAuth = async () => {
    try {
      await initiateSpotifyAuth(getEnv('SPOTIFY_CLIENT_ID'), window.location.origin + '/api/auth/callback/spotify');
    } catch (error: any) {
      showError(error.message || 'Spotify connection failed');
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await initiateGoogleAuth(getEnv('GOOGLE_CLIENT_ID'), window.location.origin + '/api/auth/callback/google');
    } catch (error: any) {
      showError(error.message || 'YouTube connection failed');
    }
  };

  const handleSync = async () => {
    if (!spotifyUrl && !youtubeUrl) {
      showError('Please provide at least one playlist URL');
      return;
    }

    setIsLoading(true);
    try {
      let sSongs: any[] = [];
      if (spotifyUrl) {
        const playlistId = spotifyUrl.split('/').pop()?.split('?')[0];
        if (playlistId) {
          sSongs = await getSpotifyPlaylist(playlistId);
          setSpotifySongs(sSongs);
        }
      } else {
        setSpotifySongs([]);
      }

      let ySongs: any[] = [];
      if (youtubeUrl) {
        // Handle both full URLs and potential list IDs
        let playlistId = youtubeUrl;
        if (youtubeUrl.includes('list=')) {
          playlistId = new URLSearchParams(new URL(youtubeUrl).search).get('list') || youtubeUrl;
        }
        ySongs = await getYouTubePlaylist(playlistId);
        setYoutubeSongs(ySongs);
      } else {
        setYoutubeSongs([]);
      }

      const results = comparePlaylists(sSongs, ySongs);
      setComparisonResults(results);
      showSuccess('Sync complete!');
    } catch (error: any) {
      if (error.status === 401) {
        showError('Unauthorized: Please connect your account first');
      } else {
        showError('Sync failed: ' + (error.message || 'Unknown error'));
      }
      // Standardized error logging to prevent header leakage
      console.error('Sync error:', error.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransferToYouTube = async () => {
    if (comparisonResults.spotifyUnique.length === 0) {
      showError('No unique Spotify tracks to transfer');
      return;
    }

    setIsLoading(true);
    try {
      const playlistId = await createYouTubePlaylist('Synced from Spotify', 'Created by RoboLab');

      for (const song of comparisonResults.spotifyUnique) {
        const videoId = await searchYouTubeTrack(song.title, song.artist);
        if (videoId) {
          await addItemsToYouTubePlaylist(playlistId, videoId);
        }
      }
      showSuccess('Transfer to YouTube complete!');
    } catch (error: any) {
      if (error.status === 401) {
        showError('Unauthorized: Please connect your account first');
      } else {
        showError('Transfer failed: ' + (error.message || 'Unknown error'));
      }
      console.error('Transfer error:', error.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    const allSongs = [...spotifySongs, ...youtubeSongs];
    if (allSongs.length === 0) {
      showError('No data to export');
      return;
    }
    exportToCSV(allSongs, 'robolab-export.csv');
    showSuccess('Exported to CSV');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      <header className="border-b-2 border-primary/20 sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-1.5 rounded-none rotate-45">
              <Music2 className="h-5 w-5 text-primary-foreground -rotate-45" />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-tighter leading-none">RoboLab Systems</h1>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Playlist Sync Module v1.0</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <ThemeToggle />
            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">System Status</span>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-mono uppercase">Operational</span>
              </div>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-none border-2 h-8 text-[10px] uppercase font-bold"
                onClick={handleSpotifyAuth}
              >
                <Music2 className="h-3 w-3 mr-2 text-[#1DB954]" />
                {authStatus.spotify ? 'Spotify Connected' : 'Connect Spotify'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-none border-2 h-8 text-[10px] uppercase font-bold"
                onClick={handleGoogleAuth}
              >
                <Youtube className="h-3 w-3 mr-2 text-[#FF0000]" />
                {authStatus.youtube ? 'YouTube Connected' : 'Connect YouTube'}
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-grow container px-4 py-8 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-none border-2 shadow-[4px_4px_0px_0px_rgba(var(--primary-rgb),0.1)]">
              <CardHeader className="border-b bg-muted/30 py-4">
                <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" /> Input Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-4">
                  <InputField
                    label="Spotify Playlist URL"
                    value={spotifyUrl}
                    onChange={setSpotifyUrl}
                    placeholder="https://open.spotify.com/playlist/..."
                    required
                  />
                  <InputField
                    label="YouTube Playlist URL"
                    value={youtubeUrl}
                    onChange={setYoutubeUrl}
                    placeholder="https://www.youtube.com/playlist?list=..."
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button
                    className="w-full rounded-none h-12 uppercase font-black tracking-widest text-xs group relative overflow-hidden"
                    disabled={isLoading}
                    onClick={handleSync}
                  >
                    {isLoading ? (
                      <RefreshCcw className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <RefreshCcw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                        Execute Sync Protocol
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-none border-2">
              <CardHeader className="border-b bg-muted/30 py-4">
                <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2">
                  <Download className="h-4 w-4 text-primary" /> Data Operations
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full rounded-none justify-start h-10 text-[10px] uppercase font-bold group"
                  onClick={handleTransferToYouTube}
                  disabled={isLoading || comparisonResults.spotifyUnique.length === 0}
                >
                  <ArrowRightLeft className="h-3.5 w-3.5 mr-2 text-primary group-hover:translate-x-1 transition-transform" />
                  Transfer Unique to YouTube
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-none justify-start h-10 text-[10px] uppercase font-bold group"
                  onClick={handleExportCSV}
                  disabled={isLoading || (spotifySongs.length === 0 && youtubeSongs.length === 0)}
                >
                  <Download className="h-3.5 w-3.5 mr-2 text-primary group-hover:translate-y-0.5 transition-transform" />
                  Export Comprehensive CSV
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Tabs defaultValue="sync" className="w-full" onValueChange={setActiveTab}>
              <div className="flex items-center justify-between mb-4 bg-muted/30 border-2 p-1">
                <TabsList className="bg-transparent h-10 gap-1">
                  <TabsTrigger value="sync" className="rounded-none h-8 text-[10px] uppercase font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Comparison View
                  </TabsTrigger>
                  <TabsTrigger value="catalog" className="rounded-none h-8 text-[10px] uppercase font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    System Catalog
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2 px-2">
                  {activeTab === 'catalog' && (
                    <div className="flex bg-background border-2 p-0.5" role="group" aria-label="Catalog View Mode">
                      <button
                        onClick={() => setViewMode('spotify')}
                        aria-pressed={viewMode === 'spotify'}
                        aria-label="View Spotify Catalog"
                        className={`px-3 py-1 text-[9px] uppercase font-bold transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${viewMode === 'spotify' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                      >
                        Spotify
                      </button>
                      <button
                        onClick={() => setViewMode('youtube')}
                        aria-pressed={viewMode === 'youtube'}
                        aria-label="View YouTube Catalog"
                        className={`px-3 py-1 text-[9px] uppercase font-bold transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${viewMode === 'youtube' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                      >
                        YouTube
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {activeTab === 'sync' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            {(viewMode === 'spotify' ? spotifySongs : youtubeSongs).length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-20">
                                  <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                                    {viewMode === 'spotify' ? (
                                      <Music2 className="h-8 w-8 opacity-20" aria-hidden="true" />
                                    ) : (
                                      <Youtube className="h-8 w-8 opacity-20" aria-hidden="true" />
                                    )}
                                    <div className="uppercase text-[10px] font-bold">No catalog data loaded</div>
                                    <div className="text-[10px] max-w-[200px] opacity-70">Enter a {viewMode === 'spotify' ? 'Spotify' : 'YouTube'} playlist URL and execute sync</div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : (
                              (viewMode === 'spotify' ? spotifySongs : youtubeSongs).map((song, i) => (
                                <TableRow key={i} className="group border-b last:border-0">
                                  <TableCell className="py-2 text-[11px] font-medium leading-tight">{song.title}</TableCell>
                                  <TableCell className="py-2 text-[10px] text-muted-foreground uppercase">{song.artist}</TableCell>
                                  <TableCell className="py-2 text-[10px] text-muted-foreground uppercase">{song.album}</TableCell>
                                  <TableCell className="py-2 text-[9px] text-right font-mono text-muted-foreground/50 px-4">{song.platformId}</TableCell>
                                </TableRow>
                              ))
                            )}
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
}
