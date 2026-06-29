"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md border-2 border-primary p-12 bg-card/50">
        <h1 className="text-6xl font-bold tracking-tighter text-primary italic">404</h1>
        <Link href="/">
          <Button variant="default" className="rounded-none uppercase italic font-bold group">
            <MoveLeft className="mr-2 h-4 w-4" />
            Return to Core
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
