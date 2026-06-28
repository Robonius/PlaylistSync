import { defineConfig } from "vitest/config";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [dyadComponentTagger(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // We use a prefix to avoid the security error, but a very generic one.
  // Alternatively, we can list the exact variables we want to expose.
  envPrefix: ['SPOTIFY_', 'YOUTUBE_', 'GOOGLE_', 'OAUTH_', 'APP_NAME', 'LOG_LEVEL'],
});
