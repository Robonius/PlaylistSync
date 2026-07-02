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
      - "8080:3000"
    environment:
      - REDIRECT_URI=https://your-domain.com
      - SPOTIFY_CLIENT_ID=your_client_id
      - SPOTIFY_CLIENT_SECRET=your_client_secret
      - GOOGLE_CLIENT_ID=your_client_id
      - GOOGLE_CLIENT_SECRET=your_client_secret
    restart: always
```

> **Note:** Ensure your Komodo instance has the GHCR credentials configured in its "Registries" section.

---

## 4. Verification Checklist

When the container is running, verify the following:

- [ ] **Runtime Hydration:** The app correctly loads Client IDs from the container environment.
- [ ] **UI Loading:** The dashboard appears without 404 errors for assets.
- [ ] **API Integration:**
    - [ ] Try connecting Spotify (OAuth flow).
    - [ ] Try connecting YouTube (OAuth flow).
- [ ] **Logs:** Check `docker logs playlistsync-test` for any startup errors.

---

## 5. Why this works (Technical Note)

Standard Next.js apps often "bake" environment variables into the static JS files at build time (using the `NEXT_PUBLIC_` prefix). To allow you to change API keys **without rebuilding the image**, we use a **Runtime Hydration** pattern:
1. The Root Layout (Server Component) reads environment variables (like `SPOTIFY_CLIENT_ID`) directly from the container environment at request time.
2. These values are passed to a client-side `RuntimeConfigProvider`.
3. Client components access these values via the `useRuntimeConfig` hook.
4. Sensitive secrets (like `SPOTIFY_CLIENT_SECRET`) never leave the server.
