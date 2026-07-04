# 🎧 RoboLab // Playlist Sync

Welcome to the vibe.

A high-precision React application for synchronizing and comparing playlists across Spotify and YouTube Music. Designed for vibe coders, music lovers, and power users who demand full control over their musical metadata.

Music shouldn't be trapped in walled gardens. Keep your playlists in sync, back them up to CSV, and let your data flow freely.

## 🚀 Quick Start

1. **Install Dependencies**:
   ```bash
   bun install
   ```
2. **Configure Environment**:
   Copy `.env.example` to `.env`. All variables MUST be using standard names (no prefix).
   ```bash
   cp .env.example .env
   ```
3. **Start Development**:
   ```bash
   bun run dev
   ```
   Access the system at `http://localhost:3000`.

## 🔐 Authentication Setup

> [!IMPORTANT]
> **Secure Context Required**: This application uses the Web Crypto API for PKCE (Proof Key for Code Exchange). Browsers restrict this API to **Secure Contexts**. To use the OAuth connect features, you MUST access the application via:
> - `localhost` or `127.0.0.1`
> - An `https://` URL
>
> Accessing the application via a local IP address (e.g., `http://192.168.x.x`) over HTTP will cause the connection buttons to fail with a security error.

This application uses **OAuth 2.0 with PKCE** for secure authentication utilizing a **backend proxy architecture**.

### 1. Spotify Setup
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Create a new App.
3. In the App settings, add your **Redirect URI** (e.g., `http://localhost:3000`).
4. Copy the **Client ID** and **Client Secret** and add them to your `.env` as `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`.

### 2. Google / YouTube Setup
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Enable the **YouTube Data API v3**.
4. Go to **APIs & Services > OAuth consent screen** and configure it for "External" usage.
5. Go to **APIs & Services > Credentials**, click **Create Credentials > OAuth client ID**.
6. Select **Web application**.
7. Add your **Authorized redirect URIs** (e.g., `http://localhost:3000`).
8. Copy the **Client ID** and **Client Secret** and add them to your `.env` as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

### 3. Token Management
Next.js Route Handlers (e.g., `/api/auth/callback/*`) manage token exchange and store access/refresh tokens in secure HTTP-only cookies. All frontend requests to Spotify and YouTube must go through backend proxies to protect these tokens.

## 🛠 Features

- **OAuth 2.0 PKCE**: Secure login without exposing secrets.
- **Playlist Diffing**: Identify unique tracks and common matches across platforms.
- **Recursive Migration**: Search and copy missing tracks from one platform to another.
- **CSV Support**: Export comparison results or import local playlist data.
- **Personal Storage**: Tokens are stored securely via HTTP-only cookies and PKCE states.

## 📦 Docker & Deployment

The system is optimized for production using Bun and Next.js Standalone mode.

### Production Execution
```bash
docker-compose up prod
```

### Environment Variables (Runtime)
The Docker image supports runtime environment injection via standard environment variables:
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `REDIRECT_URI`

## 📚 Documentation & The Vibe

Dive deeper into the code, architecture, and ethos of the project:

- [🎵 The Soul (SOUL.md)](./SOUL.md): Understand the ethos and design philosophy behind the app.
- [🚀 Project Goals (GOALS.md)](./GOALS.md): See what we've built and where we are heading next.
- [🏗️ Architecture (ARCHITECTURE.md)](./ARCHITECTURE.md): Technical breakdown of the Next.js + Bun stack, runtime hydration, and containerization.
- [🤖 Instructions for AI Agents (AGENTS.md)](./AGENTS.md): A guide for fellow vibe coders (human or AI) to navigate and contribute to the codebase without breaking the aesthetic or security standards.

---
*© 2026 RoboLab Systems // System Revision 3.0.0*
