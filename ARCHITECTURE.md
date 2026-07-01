# 🏗️ Architecture & Stack Review

## Why this Stack?

For a "vibe coder" building a fast, client-side, API-heavy tool, the chosen stack is optimal for both human developers and AI agents.

1. **Next.js 15 (App Router) + Bun:**
   - **For Humans:** Standardized project structure, built-in optimization, and Bun's lightning-fast package management and runtime.
   - **For Agents:** Predictable App Router patterns and typed APIs reduce friction and hallucinations.
2. **TypeScript:**
   - **For Humans:** Prevents runtime errors and provides clear data contracts for complex streaming platform responses.
   - **For Agents:** Type definitions offer rich context, improving code generation accuracy.
3. **Tailwind CSS + shadcn/ui:**
   - **For Humans:** Streamlined styling and beautiful, accessible components.
   - **For Agents:** Excellent at writing Tailwind classes and interacting with the transparent shadcn component source code.

## Environment & Secrets Management (No Baking Policy)

This project strictly follows a **"No Baking"** policy for sensitive information like API keys.

- **The Problem:** Standard Next.js builds can embed environment variables into the client-side bundles.
- **The Solution:** We use a robust runtime injection system with a custom `ROBOLAB_` prefix.
  1. **Runtime Injection:** All configuration must be prefixed with `ROBOLAB_`. The `NEXT_PUBLIC_` prefix is used with caution to avoid unintended build-time baking.
  2. **Docker Entrypoint:** When the container starts, `docker/entrypoint.sh` reads `ROBOLAB_` variables from the container environment and generates a `public/env-config.js` file.
  3. **Runtime Prioritization:** The app uses `src/utils/env.ts` to prioritize values from `window._env_` (injected at runtime) over any build-time fallbacks.
  4. **Build Safety:** `.env` and `.env.local` are included in `.dockerignore` to prevent local secrets from reaching the build context.

## Containerization & CI/CD

We utilize a multi-stage Docker build based on **Bun** and Next.js standalone mode to ensure environment consistency. Our CI/CD pipeline, powered by GitHub Actions, automatically builds and publishes the production image to the GitHub Container Registry (GHCR) upon every push to the `main` branch.
