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
- **The Solution:** We use a Next.js-native runtime hydration system.
  1. **Runtime Hydration:** Non-sensitive environment variables (like Client IDs) are read on the server during the Root Layout render and passed to a client-side `RuntimeConfigProvider`.
  2. **No Build-Time Inlining:** By avoiding the `NEXT_PUBLIC_` prefix and reading variables in a server-side layout, we ensure they are fetched from the actual container environment at request time.
  3. **Runtime Prioritization:** Client components use the `useRuntimeConfig` hook to access these variables, ensuring consistency across environments using a single Docker image.
  4. **Build Safety:** `.env` and `.env.local` are included in `.dockerignore` to prevent local secrets from reaching the build context.

## Containerization & CI/CD

We utilize a multi-stage Docker build based on **Bun** and Next.js standalone mode to ensure environment consistency. Our CI/CD pipeline, powered by GitHub Actions, automatically builds and publishes the production image to the GitHub Container Registry (GHCR) upon every push to the `main` branch.
