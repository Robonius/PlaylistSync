import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/globals.css";
import { Providers } from "@/components/providers";
import { RuntimeConfigProvider, RuntimeConfig } from "@/components/runtime-config-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RoboLab - Playlist Comparison Tool",
  icons: { icon: "/icon.svg", shortcut: "/favicon.ico" },
  description: "Sync, backup, and transfer playlists across streaming platforms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read runtime environment variables on the server.
  // These are NOT prefixed with NEXT_PUBLIC_ to ensure they are not baked at build time.
  const runtimeConfig: RuntimeConfig = {
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID || "",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    REDIRECT_URI: process.env.REDIRECT_URI || "",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <RuntimeConfigProvider config={runtimeConfig}>
          <Providers>{children}</Providers>
        </RuntimeConfigProvider>
      </body>
    </html>
  );
}
