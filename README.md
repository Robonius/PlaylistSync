# 🎵 Playlist Comparison Tool

Welcome to the vibe.

This is a seamless, client-side application that empowers users to sync, backup, and transfer their music playlists across different streaming platforms (Spotify, YouTube Music) and local formats (CSV), bypassing the need for expensive third-party subscription services.

## 🚀 Features

- **Cross-Platform Sync:** Read and diff playlists from Spotify and YouTube Music APIs.
- **Massive Playlists:** Handles pagination to support massive tracklists.
- **Bi-directional Sync:** Write missing tracks directly to Spotify and YouTube.
- **Universal Bridge:** CSV Import/Export functionality to bypass API lockouts (like Amazon Music).
- **Vibe Interface:** Modern, dark-mode, accessible UI built for music lovers and DJs.

## 🏗️ Tech Stack

- **Framework:** React 18
- **Language:** TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui + Radix UI
- **Routing:** React Router DOM (v6)

## 🛠️ Getting Started

### Prerequisites

Ensure you have Node.js and `npm` installed.

### Installation

1. Clone the repository.
2. Install dependencies:
   `npm install`

### Running the App

Start the development server:
`npm run dev`

Build for production:
`npm run build`

Preview production build:
`npm run preview`

### Running Tests

Execute the test suite using Vitest:
`npm test`

## 📝 Environment Variables

To fully utilize the API integrations, you need to configure your access tokens.
Note: Currently these are defined directly in `src/utils/api.ts` for ease of development, but should ideally be moved to an `.env` file in production:

- `SPOTIFY_ACCESS_TOKEN`: Your Spotify API token.
- `YOUTUBE_API_KEY`: Your YouTube Data API v3 key.

Stay chill. Keep syncing. 🎧
