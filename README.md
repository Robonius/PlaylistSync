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
