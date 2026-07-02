# RoboLab // Playlist Sync

A high-precision React application for synchronizing and comparing playlists across Spotify and YouTube Music. Designed for developers and power users who need full control over their musical metadata.

## 🚀 Quick Start

1. **Install Dependencies**:
   ```bash
   bun install
   ```
2. **Configure Environment**:
   Copy `.env.example` to `.env`. All variables MUST be prefixed with `ROBOLAB_`.
   ```bash
   cp .env.example .env
   ```
3. **Start Development**:
   ```bash
   bun run dev
   ```
   Access the system at `http://localhost:3000`.

## 🔐 Authentication Setup

This application uses **OAuth 2.0 with PKCE** for secure, client-side authentication.

### 1. Spotify Setup
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Create a new App.
3. In the App settings, add your **Redirect URI** (e.g., `http://localhost:8080`).
4. Copy the **Client ID** and add it to your `.env` as `ROBOLAB_SPOTIFY_CLIENT_ID`.

### 2. Google / YouTube Setup
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Enable the **YouTube Data API v3**.
4. Go to **APIs & Services > OAuth consent screen** and configure it for "External" usage.
5. Go to **APIs & Services > Credentials**, click **Create Credentials > OAuth client ID**.
6. Select **Web application**.
7. Add your **Authorized redirect URIs** (e.g., `http://localhost:8080`).
8. Copy the **Client ID** and add it to your `.env` as `ROBOLAB_GOOGLE_CLIENT_ID`.

## 🛠 Features

- **OAuth 2.0 PKCE**: Secure login without exposing secrets.
- **Playlist Diffing**: Identify unique tracks and common matches across platforms.
- **Recursive Migration**: Search and copy missing tracks from one platform to another.
- **CSV Support**: Export comparison results or import local playlist data.
- **Personal Storage**: Tokens are stored in `localStorage` for session persistence.

## 📦 Docker & Deployment

The system is optimized for production using Bun and Next.js Standalone mode.

### Production Execution
```bash
docker-compose up prod
```

### Environment Variables (Runtime)
The Docker image supports runtime environment injection via `ROBOLAB_` prefixed variables:
- `ROBOLAB_SPOTIFY_CLIENT_ID`
- `ROBOLAB_GOOGLE_CLIENT_ID`
- `ROBOLAB_REDIRECT_URI`

## ⚖️ Standards

- **Security**: Mandatory `type="password"` for all sensitive inputs. Sanitize CSV exports to prevent formula injection.
- **Accessibility**: ARIA-compliant components and robust keyboard navigation.
- **Code Health**: Standardized error sanitization to prevent sensitive header leakage.

---
*© 2026 RoboLab Systems // System Revision 3.0.0*
