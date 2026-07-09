"use client";
import React from 'react';
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, BookOpen, Music2, Youtube, Shield, Cpu, Zap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex items-center justify-between border-b-2 border-primary/20 pb-6">
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-none border-2 h-10 w-10" asChild>
                  <Link href="/">
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Back to Command Center</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Back to Command Center</p>
              </TooltipContent>
            </Tooltip>
            <div className="flex items-center gap-3">
              <div className="bg-primary p-1.5 rounded-none rotate-45">
                <BookOpen className="h-5 w-5 text-primary-foreground -rotate-45" />
              </div>
              <h1 className="text-xl font-black uppercase tracking-tighter italic">RoboLab // Documentation</h1>
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Protocol Version: 1.0.4-BETA</p>
          </div>
        </header>

        <main className="grid gap-12">
          <section className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary">01. Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              The RoboLab Playlist Synchronization Module (PSM) is a high-performance terminal for comparing and transferring musical assets between industrial streaming platforms. It leverages OAuth 2.0 PKCE protocols to ensure secure, client-side only data processing.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-none border-2 bg-muted/20">
              <CardHeader>
                <CardTitle className="text-xs uppercase flex items-center gap-2">
                  <Music2 className="h-4 w-4 text-[#1DB954]" /> Spotify Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>To initialize Spotify subsystems:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Navigate to Spotify Developer Dashboard</li>
                  <li>Register application and obtain Client ID</li>
                  <li>Configure Redirect URI to match terminal location</li>
                  <li>Authorize "playlist-read-private" scopes</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-none border-2 bg-muted/20">
              <CardHeader>
                <CardTitle className="text-xs uppercase flex items-center gap-2">
                  <Youtube className="h-4 w-4 text-[#FF0000]" /> YouTube Subsystems
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>YouTube operations require:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Google Cloud Console project activation</li>
                  <li>YouTube Data API v3 enablement</li>
                  <li>OAuth 2.0 credentials for write access</li>
                  <li>Public/Private playlist visibility permissions</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <section className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary">02. Core Protocols</h2>

            <div className="grid gap-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase mb-1">Sync Protocol</h3>
                  <p className="text-sm text-muted-foreground">The system fetches both catalogs and performs a bitwise comparison of track metadata (Title + Artist). Unique items are flagged for potential transfer.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase mb-1">Security Standard</h3>
                  <p className="text-sm text-muted-foreground">No data is stored on RoboLab servers. All tokens reside in volatile memory and are purged upon session termination. We follow a "No Baking" policy for API secrets.</p>
                </div>
              </div>
            </div>
          </section>

          <footer className="pt-12 pb-8 text-center border-t border-dashed">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              End of Transmission // RoboLab Systems Group
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
