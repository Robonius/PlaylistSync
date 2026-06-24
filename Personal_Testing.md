# Personal Testing Guide: Remote Docker Images

This guide explains how to test the **private** production Docker image pulled from GitHub Container Registry (GHCR) on your local machine.

## 1. Prerequisites: GitHub Authentication

Since the repository is private, you must authenticate your local Docker client with GHCR.

### A. Create a Personal Access Token (PAT)
1. Go to [GitHub Settings > Developer Settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens).
2. Click **Generate new token (classic)**.
3. Give it a name (e.g., `Docker GHCR Read`).
4. Select the **`read:packages`** scope.
5. Copy the generated token immediately (you won't see it again).

### B. Authenticate Docker
Run the following command in your terminal:
```bash
echo YOUR_TOKEN_HERE | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

---

## 2. Testing the Remote Image (The Easy Way)

I have provided a helper script `test-remote.sh` that automates the cleanup, pulling, and running process.

1. Ensure you have a `.env` file with your API keys.
2. Run the script:
   ```bash
   ./test-remote.sh
   ```
3. Access the app at: **http://localhost:8080**

---

## 3. Komodo Stack Configuration

If you prefer using [Komodo](https://github.com/moghtech/komodo) for deployment management, use the following Stack snippet:

```yaml
version: '3.8'

services:
  playlistsync:
    image: ghcr.io/robonius/playlistsync:latest
    ports:
      - "8080:80"
    environment:
      - VITE_SPOTIFY_API_URL=https://api.spotify.com/v1
      - VITE_YOUTUBE_API_URL=https://www.googleapis.com/youtube/v3
      - VITE_SPOTIFY_ACCESS_TOKEN=your_token_here
      - VITE_YOUTUBE_API_KEY=your_key_here
    restart: always
```

> **Note:** Ensure your Komodo instance has the GHCR credentials configured in its "Registries" section.

---

## 4. Verification Checklist

When the container is running, verify the following:

- [ ] **Runtime Env Vars:** Open the browser console and type `window._env_`. It should contain the keys you passed via Docker.
- [ ] **UI Loading:** The dashboard appears without 404 errors for assets.
- [ ] **API Integration:**
    - [ ] Try fetching a Spotify playlist (using a valid token).
    - [ ] Try searching for a YouTube track.
- [ ] **Logs:** Check `docker logs playlistsync-test` for any Nginx or entrypoint errors.

---

## 5. Why this works (Technical Note)

Standard Vite apps "bake" environment variables into the static JS files at build time. To allow you to change API keys **without rebuilding the image**, we use a custom entrypoint (`docker/entrypoint.sh`) that:
1. Reads all `VITE_` variables from the container environment.
2. Generates a `env-config.js` file inside the container.
3. Injects this script into `index.html`.
4. The app uses `src/utils/env.ts` to prioritize these runtime values.
