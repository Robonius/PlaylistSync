"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname,
    );
  }, [pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold uppercase tracking-tighter italic">Error 404</h1>
        <p className="text-sm text-muted-foreground uppercase tracking-widest">Protocol mismatch: route not found</p>
        <Link href="/" className="inline-block px-6 py-2 border-2 uppercase text-[10px] font-bold hover:bg-primary hover:text-primary-foreground transition-colors">
          Return to Command Center
        </Link>
      </div>
    </div>
  );
}
