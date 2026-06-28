# 🏗️ Architecture & Stack Review

## Why this Stack?

For a "vibe coder" building a fast, client-side, API-heavy tool, the chosen stack is optimal for both human developers and AI agents.

1. **Vite + React 18 + React Router v7:**
   - **For Humans:** Instant HMR, extremely fast builds, and a massive ecosystem. React Router v7 provides robust routing and data loading patterns.
   - **For Agents:** Standardized, predictable structure. Fast feedback loops when running build/lint commands.
2. **TypeScript:**
   - **For Humans:** Prevents runtime errors, self-documenting APIs (crucial when dealing with massive Spotify/YouTube JSON responses).
   - **For Agents:** Type definitions provide massive context. An AI agent knows exactly what a `Song` object is, reducing hallucinations when writing data manipulation logic.
3. **Tailwind CSS + shadcn/ui:**
   - **For Humans:** No context switching between CSS files and JSX. Beautiful, accessible components out of the box.
   - **For Agents:** AI agents are exceptionally good at writing Tailwind classes. Because shadcn is copy-paste driven, the agent has the source code of the component directly in the repo (`src/components/ui`), meaning it doesn't have to guess how a black-box UI library behaves.

## Environment & Secrets Management (No Baking Policy)

This project strictly follows a **"No Baking"** policy for sensitive information like API keys.

- **Vite's "Baking" Problem:** Standard Vite apps replace `import.meta.env....` with hardcoded strings at build time. This risks accidentally embedding secrets in the published Docker image.
- **The Solution:** We use a robust runtime injection system.
  1. **Runtime Keys:** Sensitive keys like `SPOTIFY_API_KEY` and `YOUTUBE_API_KEY` are **not** prefixed with ``. This ensures Vite's compiler ignores them during the build.
  2. **Docker Entrypoint:** When the container starts, `docker/entrypoint.sh` reads these keys from the container environment and generates a `public/env-config.js` file.
  3. **Runtime Prioritization:** The app uses `src/utils/env.ts` to prioritize values from `window._env_` (injected at runtime) over any build-time fallbacks.
  4. **Build Safety:** `.env` and `.env.local` are included in `.dockerignore` to prevent local secrets from ever reaching the build context.

## Code Review: Current State
- **Strengths:**
  - The API logic is decoupled into `src/utils/api.ts`.
  - CSV parsing is handled nicely by `papaparse` in a dedicated util file.
  - The use of Promises and `async/await` is modern and clean.
  - **Runtime Injection:** Successfully decoupled secrets from build artifacts.
- **Areas for Improvement:**
  - `src/pages/Index.tsx` is still a "God Object." It handles state for URLs, tokens, songs, UI modes, loading states, and contains massive handler functions.
  - *Recommendation for future agents:* Refactor `Index.tsx` by breaking the UI into smaller components (e.g., `<PlaylistTable />`, `<ControlPanel />`) and move state management to a custom hook (e.g., `usePlaylistSync()`).
  - *Fuzzy Matching:* The current comparison relies on exact string matching (`youtubeSong.title === spotifySong.title`). This will fail if YouTube has "Song Name (Official Video)" and Spotify has "Song Name". Implementing a Levenshtein distance or generalized fuzzy search would vastly improve the sync accuracy.

## Containerization & CI/CD

We utilize a multi-stage Docker build based on **Node.js 24** to ensure environment consistency across development and production. Our CI/CD pipeline, powered by GitHub Actions, automatically builds and publishes the production image to the GitHub Container Registry (GHCR) upon every push to the `main` branch. This approach eliminates "it works on my machine" issues and simplifies deployment.
