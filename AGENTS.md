# 🤖 Instructions for AI Agents

Welcome, fellow agent. If you are reading this, you are tasked with expanding or maintaining this codebase. Please adhere to the following rules to maintain the vibe and structure.

## Tech Stack Overview
- **Framework:** React 18
- **Language:** TypeScript (Strict typing preferred)
- **Bundler:** Vite
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui + Radix UI
- **Routing:** React Router DOM (v6)
- **State/Query Management:** React hook state for now, but `@tanstack/react-query` is installed if you need it.
- **Containerization:** Docker / Docker Compose
- **CI/CD:** GitHub Actions (for Docker publishing)

## Architectural Rules
1. **Source Code Location:** All source code lives in the `src` directory.
2. **Pages vs Components:**
   - Full views go in `src/pages/`.
   - Reusable bits go in `src/components/`.
   - Utility functions (API calls, parsers) go in `src/utils/`.
3. **Routing:** `src/App.tsx` is the source of truth for routes. If you add a new page, register it there BEFORE the catch-all `*` route.
4. **Styling:** Always use Tailwind CSS for styling components. Use the `cn()` utility from `src/lib/utils.ts` for conditionally merging Tailwind classes.
5. **Infrastructure Consistency:** Use the provided Docker configurations (`Dockerfile`, `docker-compose.yml`) to ensure local development matches the production environment.

## UI / UX Directives
- **shadcn/ui first:** We already have Radix UI primitives and shadcn components installed. Use them. If you need a new shadcn component, look in `src/components/ui/` first to see if it exists. DO NOT edit the files inside `src/components/ui/` directly; they are considered vendor files.
- **Dark Mode:** The app defaults to a dark theme. Keep text highly legible (e.g., `text-white` on `bg-gray-900`).
- **Icons:** Use `lucide-react`.

## Pre-Commit Verification
- Always run `pnpm run lint` and `pnpm run build` to verify your TypeScript and ESLint rules before submitting changes.
- Ensure any new environment variables or API keys are documented in `README.md`.
