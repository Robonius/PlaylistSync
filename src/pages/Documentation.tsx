import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, BookOpen, Key, Music2, Youtube, ShieldCheck } from 'lucide-react';
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
            <p className="text-muted-foreground leading-relaxed">
              RoboLab // Sync is a high-precision tool designed for the synchronization of auditory data across disparate platforms.
              It provides a localized, secure interface for diffing catalogs, migrating tracklists, and archiving auditory metadata.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-none border-2">
              <CardHeader className="bg-muted/50 border-b">
                <CardTitle className="text-sm uppercase flex items-center gap-2">
                  <Key className="h-4 w-4" /> Auth Protocol: Spotify
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-xs text-muted-foreground italic">
                  Requires OAuth 2.0 Access Token with the following scopes:
                </p>
                <ul className="text-xs space-y-2 list-disc pl-4 uppercase font-bold">
                  <li>playlist-read-private</li>
                  <li>playlist-modify-public</li>
                  <li>playlist-modify-private</li>
                </ul>
                <p className="text-xs leading-relaxed">
                  Generate tokens via the Spotify for Developers dashboard. Tokens expire after 3600 seconds.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-none border-2">
              <CardHeader className="bg-muted/50 border-b">
                <CardTitle className="text-sm uppercase flex items-center gap-2">
                  <Youtube className="h-4 w-4" /> Auth Protocol: YouTube
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-xs text-muted-foreground italic">
                  Synchronization requires OAuth credentials for write operations:
                </p>
                <ul className="text-xs space-y-2 list-disc pl-4 uppercase font-bold">
                  <li>https://www.googleapis.com/auth/youtube</li>
                </ul>
                <p className="text-xs leading-relaxed">
                  Read-only operations may use a standard API Key, but full sync requires an active OAuth session.
                </p>
              </CardContent>
            </Card>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold uppercase tracking-widest border-l-4 border-primary pl-4">Operational Workflow</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="h-8 w-8 shrink-0 bg-muted flex items-center justify-center font-bold border-2">01</div>
                <div>
                  <h3 className="font-bold uppercase text-sm">Initialize Sources</h3>
                  <p className="text-xs text-muted-foreground">Input Source (Spotify) and Destination (YouTube) identifiers. Ensure valid tokens are mapped in the secure fields.</p>
                </div>
              </div>
              <Separator />
              <div className="flex gap-4">
                <div className="h-8 w-8 shrink-0 bg-muted flex items-center justify-center font-bold border-2">02</div>
                <div>
                  <h3 className="font-bold uppercase text-sm">Execute Sync</h3>
                  <p className="text-xs text-muted-foreground">The system will perform a recursive fetch of all track data, diff the results, and identify unique artifacts on both platforms.</p>
                </div>
              </div>
              <Separator />
              <div className="flex gap-4">
                <div className="h-8 w-8 shrink-0 bg-muted flex items-center justify-center font-bold border-2">03</div>
                <div>
                  <h3 className="font-bold uppercase text-sm">Commit Changes</h3>
                  <p className="text-xs text-muted-foreground">Select 'Copy to Spotify' or 'Copy to YouTube' to migrate missing tracks. The system uses fuzzy matching logic to resolve cross-platform identities.</p>
                </div>
              </div>
            </div>
          </section>

          <footer className="pt-12 pb-8 text-center border-t border-dashed">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              End of Documentation // System Revision 2.6.0
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Documentation;
