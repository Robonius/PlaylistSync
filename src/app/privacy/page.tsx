"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, ChevronLeft, Lock, EyeOff, Database } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-mono uppercase tracking-tighter">
      <header className="border-b-2 bg-card/50 backdrop-blur-md p-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon" className="rounded-none border-2">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-bold flex items-center gap-2 italic">
              <Shield className="h-5 w-5 text-primary" /> Privacy Protocol
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow container py-12 max-w-3xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4 flex flex-col items-center text-center p-6 border-2 border-dashed">
            <Lock className="h-10 w-10 text-primary" />
            <h2 className="text-xs font-bold tracking-widest">Encrypted Transmission</h2>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
