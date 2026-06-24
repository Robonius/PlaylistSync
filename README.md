# Playlist Sync Tool

A React application to compare and sync playlists across Spotify, YouTube Music, and Amazon Music (via CSV).

## Features

- **Compare Playlists**: See which songs are unique to Spotify and which are unique to YouTube Music.
- **Copy to Spotify**: Take missing songs from a YouTube playlist, search for them on Spotify, and add them to a newly created Spotify playlist.
- **Copy to YouTube**: Take missing songs from a Spotify playlist, search for them on YouTube, and add them to a newly created YouTube playlist.
- **CSV Export/Import**: Export your comparison results to a CSV file. You can also import a CSV file to act as one of the playlists.

## API Authentication Requirements

To use the playlist copying features, you will need active API tokens:

### Spotify
- **Spotify Access Token**: You need a valid Spotify OAuth token with scopes like `playlist-modify-public` and `playlist-modify-private`. Because these tokens expire quickly (typically in 1 hour), you must generate one and paste it into the UI.

### YouTube Music
- **YouTube API Key**: Note that while fetching public playlists can be done with a simple API key, **creating playlists and adding items requires an OAuth 2.0 token** with the `https://www.googleapis.com/auth/youtube` scope. When using the "Copy to YouTube" feature, paste your active OAuth token into the "YouTube API Key" field.

### Amazon Music
- **Limitation**: Amazon Music does not provide a public API for developers to manage playlists.
- **Workaround**: To compare or sync with Amazon Music, you must first export your Amazon Music playlist to a CSV file (using a third-party tool). You can then use the **Import CSV** feature in this app to load your Amazon Music songs, compare them against Spotify/YouTube, and copy them over.

## Setup

1. Run `pnpm install` to install dependencies.
2. Run `pnpm run dev` to start the development server.

## Docker & Deployment

This project is fully containerized for both development and production.

### Using the Published Image (Recommended)
The easiest way to run the application is using the pre-built Docker image published to the GitHub Container Registry (GHCR).

1. **Pull and run the latest image:**
   ```bash
   docker-compose up prod
   ```
   The app will be available at [http://localhost:8080](http://localhost:8080).

### Local Development & Custom Builds
If you are making changes to the code and want to test them locally, use the build-specific compose file.

1. **Start the development server with Hot Module Replacement (HMR):**
   ```bash
   docker-compose -f docker-compose.build.yml up dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173).

2. **Test a local production build:**
   ```bash
   docker-compose -f docker-compose.build.yml up prod-local
   ```
   The app will be available at [http://localhost:8081](http://localhost:8081).

### Automated Publishing
Every push to the `main` branch triggers a GitHub Action that builds and publishes a production-ready Docker image to GHCR.

**How to verify the image is published:**
1. **GitHub Actions:** Check the [Actions tab](https://github.com/Robonius/PlaylistSync/actions) for the "Docker Publish" workflow status.
2. **GitHub Packages:** Navigate to the "Packages" section on the repository's home page (or your profile's packages) to see `playlistsync`.
3. **Manual Pull:** Run `docker pull ghcr.io/robonius/playlistsync:latest` to verify accessibility.

## Local Testing with Remote Docker Images

For instructions on how to test the production Docker images pulled from GHCR locally, see [Personal_Testing.md](./Personal_Testing.md).

The project supports runtime environment variable injection for Docker containers, allowing you to use your own API keys without rebuilding the image.
