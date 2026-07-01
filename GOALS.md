# 🚀 Project Goals

## Core Objective
To create a seamless, client-side application that empowers users to sync, backup, and transfer their music playlists across different streaming platforms (Spotify, YouTube Music) and local formats (CSV), bypassing the need for expensive third-party subscription services.

## Short-Term Goals (The Now)
- [x] Read playlists from Spotify and YouTube Music APIs.
- [x] Handle pagination to support massive playlists.
- [x] Diff playlists to find missing tracks.
- [x] Write missing tracks to Spotify and YouTube.
- [x] CSV Import/Export as a universal bridge (with formula injection protection).
- [x] Modern, dark-mode, accessible UI using React + shadcn/ui.
- [x] Implement Dockerization and automated CI/CD for image publishing.
- [x] Robust Runtime Environment Variable Injection for Docker production images.
- [x] Testing suite setup with Vitest and Playwright.
- [x] Full transition to Next.js 15 (App Router) and Bun.

## Long-Term Vision (The Future)
- **Apple Music Integration:** Add MusicKit JS support.
- **Tidal Integration:** For the audiophiles.
- **Fuzzy Matching Improvements:** Better logic for matching tracks between platforms when the metadata isn't a perfect 1:1 match.
- **Background Sync / Automation:** Allow users to set up rules (e.g., "Always keep 'Summer Vibes' in sync between Spotify and YouTube").

## Target Audience
Music lovers, DJs, playlist curators, and anyone tired of losing their meticulously crafted tracklists when switching streaming platforms.
