# System Configuration Guide: RoboLab Sync Tool

## 1. Spotify Configuration
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Create an App with redirect URI `http://localhost:8080/callback`.
3. Copy the **Client ID** to `SPOTIFY_CLIENT_ID` in `.env`.

## 2. YouTube Configuration
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable **YouTube Data API v3**.
3. Create an **OAuth client ID** (Web application) with redirect URI `http://localhost:8080/callback`.
4. Copy the **Client ID** to `GOOGLE_CLIENT_ID` in `.env`.
