"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Activity, Radio } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const ApiStatus = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b-2 bg-card/50 backdrop-blur-md p-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon" className="rounded-none border-2">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-bold uppercase italic flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" /> System Uptime
            </h1>
          </div>
          <Radio className="h-4 w-4 text-green-500 animate-pulse" />
        </div>
      </header>

      <main className="flex-grow container py-12 max-w-4xl space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 border-2 bg-muted/10 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest">Spotify API Core</h2>
            <Badge className="bg-green-500/20 text-green-500 border-green-500/50 rounded-none text-[10px]">Operational</Badge>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApiStatus;
