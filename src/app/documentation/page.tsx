"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Book, Music2, Youtube, ShieldCheck, Zap } from "lucide-react";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b-2 bg-card/50 backdrop-blur-md p-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon" className="rounded-none border-2">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back to Home</span>
              </Button>
            </Link>
            <h1 className="text-lg font-bold uppercase tracking-tight italic flex items-center gap-2">
              <Book className="h-5 w-5 text-primary" /> System Documentation
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow container py-12 max-w-4xl">
        <div className="space-y-12">
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b-2 border-primary pb-2 w-fit">
              <Zap className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold uppercase italic">Quick Start</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-none border-2 bg-muted/10">
                <CardHeader>
                  <CardTitle className="text-sm uppercase flex items-center gap-2">
                    <Music2 className="h-4 w-4 text-green-500" /> Spotify Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs leading-relaxed opacity-80">
                  Retrieve your Playlist ID from the Spotify share URL.
                </CardContent>
              </Card>
              <Card className="rounded-none border-2 bg-muted/10">
                <CardHeader>
                  <CardTitle className="text-sm uppercase flex items-center gap-2">
                    <Youtube className="h-4 w-4 text-red-500" /> YouTube Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs leading-relaxed opacity-80">
                  Playlist IDs can be found in the URL after 'list='.
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Documentation;
