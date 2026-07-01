"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const IndexContent = dynamic(() => import('./IndexContent'), { ssr: false });

export default function IndexPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-background text-foreground uppercase text-[10px] font-bold tracking-widest animate-pulse">Initializing RoboLab...</div>}>
      <IndexContent />
    </Suspense>
  );
}
