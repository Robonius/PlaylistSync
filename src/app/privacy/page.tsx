"use client";
import React from 'react';
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { ChevronLeft, Shield, Lock, EyeOff, Database } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function PrivacyPage() {
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
                <Shield className="h-5 w-5 text-primary-foreground -rotate-45" />
              </div>
              <h1 className="text-xl font-black uppercase tracking-tighter italic">RoboLab // Privacy</h1>
            </div>
          </div>
        </header>

        <main className="space-y-12">
          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest border-l-4 border-primary pl-4">Privacy Protocol</h2>
            <p className="text-muted-foreground leading-relaxed">
              At RoboLab Industrial Systems, we believe in radical transparency and absolute data sovereignty.
              The Playlist Synchronization Module (PSM) is engineered as a client-side first application.
            </p>
          </section>

          <div className="grid gap-8">
            <div className="flex gap-6">
              <div className="h-12 w-12 shrink-0 bg-muted flex items-center justify-center border-2">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold uppercase tracking-tight">Zero-Storage Policy</h3>
                <p className="text-sm text-muted-foreground">
                  We do not operate any centralized databases for user data. Your API keys, tokens, and playlist identifiers are never transmitted to our servers. They are processed entirely within your browser's execution environment.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="h-12 w-12 shrink-0 bg-muted flex items-center justify-center border-2">
                <EyeOff className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold uppercase tracking-tight">Credential Handling</h3>
                <p className="text-sm text-muted-foreground">
                  OAuth tokens and API keys are stored in volatile memory. If you refresh your browser or close the session, all sensitive credentials are wiped from the runtime. We recommend revoking temporary tokens after use.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="h-12 w-12 shrink-0 bg-muted flex items-center justify-center border-2">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold uppercase tracking-tight">Third-Party Interfaces</h3>
                <p className="text-sm text-muted-foreground">
                  The system communicates directly with Spotify (api.spotify.com) and Google (www.googleapis.com). These interactions are subject to their respective privacy policies. We do not act as a proxy or interceptor for these transmissions.
                </p>
              </div>
            </div>
          </div>

          <footer className="pt-12 pb-8 text-center border-t border-dashed">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Last Revision: January 2026 // Privacy Protocol v1.4
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
