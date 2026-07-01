import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, BookOpen, Key, Music2, Youtube, ShieldCheck, Globe, Server } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Documentation = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-primary selection:text-primary-foreground p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon" className="rounded-none border-2">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back to Home</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold uppercase tracking-tighter italic">RoboLab // Docs</span>
            </div>
          </div>
        </header>

        <main className="space-y-12">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold uppercase tracking-widest border-l-4 border-primary pl-4">System Overview</h2>
            <p className="text-muted-foreground leading-relaxed uppercase text-[12px] font-bold">
              RoboLab // Sync is a high-precision tool designed for the synchronization of auditory data across disparate platforms.
              It uses OAuth 2.0 with PKCE for secure authentication without exposing secrets.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-widest border-l-4 border-primary pl-4">Authentication Configuration</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="rounded-none border-2">
                <CardHeader className="bg-muted/50 border-b">
                  <CardTitle className="text-sm uppercase flex items-center gap-2">
                    <Music2 className="h-4 w-4 text-[#1DB954]" /> Spotify Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2 text-[10px] uppercase">
                    <p className="font-bold">1. Dashboard Access</p>
                    <p className="text-muted-foreground">Visit developer.spotify.com/dashboard</p>
                    <p className="font-bold">2. Redirect URI</p>
                    <p className="text-muted-foreground">Add http://localhost:8080 to your app settings</p>
                    <p className="font-bold">3. Environment</p>
                    <p className="text-muted-foreground">Set ROBOLAB_SPOTIFY_CLIENT_ID in your .env</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-none border-2">
                <CardHeader className="bg-muted/50 border-b">
                  <CardTitle className="text-sm uppercase flex items-center gap-2">
                    <Youtube className="h-4 w-4 text-red-500" /> Google Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2 text-[10px] uppercase">
                    <p className="font-bold">1. Cloud Console</p>
                    <p className="text-muted-foreground">Visit console.cloud.google.com</p>
                    <p className="font-bold">2. Enable API</p>
                    <p className="text-muted-foreground">Enable 'YouTube Data API v3'</p>
                    <p className="font-bold">3. OAuth Client</p>
                    <p className="text-muted-foreground">Create a 'Web Application' client ID</p>
                    <p className="font-bold">4. Environment</p>
                    <p className="text-muted-foreground">Set ROBOLAB_GOOGLE_CLIENT_ID in your .env</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-widest border-l-4 border-primary pl-4">Environment Variables</h2>
            <Card className="rounded-none border-2 bg-muted/20">
              <CardContent className="p-6">
                <pre className="text-[10px] leading-relaxed text-primary overflow-x-auto">
{`# REQUIRED CONFIGURATION
ROBOLAB_REDIRECT_URI=http://localhost:8080
ROBOLAB_SPOTIFY_CLIENT_ID=your_id_here
ROBOLAB_GOOGLE_CLIENT_ID=your_id_here

# OPTIONAL READ-ONLY KEYS
ROBOLAB_SPOTIFY_API_KEY=
ROBOLAB_YOUTUBE_API_KEY=`}
                </pre>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-widest border-l-4 border-primary pl-4">Operational Workflow</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="h-8 w-8 shrink-0 bg-muted flex items-center justify-center font-bold border-2">01</div>
                <div>
                  <h3 className="font-bold uppercase text-sm">Initialize Auth</h3>
                  <p className="text-xs text-muted-foreground">Toggle 'OAuth Login' and authenticate with both platforms. Tokens are stored securely in localStorage.</p>
                </div>
              </div>
              <Separator />
              <div className="flex gap-4">
                <div className="h-8 w-8 shrink-0 bg-muted flex items-center justify-center font-bold border-2">02</div>
                <div>
                  <h3 className="font-bold uppercase text-sm">Diff Catalogs</h3>
                  <p className="text-xs text-muted-foreground">Input playlist URLs and execute sync. The system identifies unique tracks on each side.</p>
                </div>
              </div>
              <Separator />
              <div className="flex gap-4">
                <div className="h-8 w-8 shrink-0 bg-muted flex items-center justify-center font-bold border-2">03</div>
                <div>
                  <h3 className="font-bold uppercase text-sm">Commit Sync</h3>
                  <p className="text-xs text-muted-foreground">Use 'Copy Unique' to migrate missing tracks to the destination platform.</p>
                </div>
              </div>
            </div>
          </section>

          <footer className="pt-12 pb-8 text-center border-t border-dashed">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              End of Documentation // System Revision 3.0.0
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Documentation;
