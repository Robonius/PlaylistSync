# RoboLab Sync Tool

A professional-grade playlist synchronization and comparison utility for music infrastructure management. Supports Spotify, YouTube Music, and Amazon Music (via CSV).

## Features

- **Side-by-Side Comparison**: Real-time diffing of playlists across different streaming platforms.
- **Bi-Directional Sync**: Seamlessly copy missing tracks from YouTube to Spotify or vice versa.
- **OAuth 2.0 Integration**: Secure authentication with Spotify and Google using PKCE.
- **CSV Data Exchange**: Export comparison matrices or import external data.

## Setup

1. **Clone & Install**:
   ```bash
   pnpm install
   ```

2. **Configure Environment**:
   Copy `.env.example` to `.env` and provide your Client IDs (see [USAGE.md](./USAGE.md)).

3. **Development**:
   ```bash
   pnpm run dev
   ```

4. **Production (Docker)**:
   ```bash
   docker-compose up prod
   ```

---
© 2024 RoboLab // Industrial Playlist Synchronization Module
