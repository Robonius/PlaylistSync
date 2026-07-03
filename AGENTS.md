# 🤖 Instructions for AI Agents

Welcome, fellow agent. If you are reading this, you are tasked with expanding or maintaining this codebase. Please adhere to the following rules to maintain the vibe and structure.

## Tech Stack Overview
- **Runtime:** Bun
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (Strict typing preferred)
- **Styling:** Tailwind CSS (utilize extensively for layout, spacing, colors)
- **Components:** shadcn/ui + Radix UI
- **State/Query Management:** React hook state for now, but `@tanstack/react-query` is installed if you need it.
- **Package Manager:** Bun (Note: The use of pnpm, npm, or yarn is strictly avoided).
- **Containerization:** Docker / Docker Compose
- **CI/CD:** GitHub Actions (for Docker publishing)

## Architectural Rules
1. **Source Code Location:** All source code lives in the `src` directory.
2. **Pages vs Components:**
   - App Router pages and layouts go in `src/app/`.
   - Reusable components go in `src/components/`.
   - Utility functions (API calls, parsers) go in `src/utils/`.
3. **Routing:** The directory structure in `src/app/` is the source of truth for routes.
4. **Styling:** Always use Tailwind CSS for styling components. Use the `cn()` utility from `src/lib/utils.ts` for conditionally merging Tailwind classes.
5. **Infrastructure Consistency:** Use the provided Docker configurations (`Dockerfile`, `docker-compose.yml and docker-compose.build.yml`) to ensure local development matches the production environment.

## UI / UX Directives
- **shadcn/ui first:** We ALREADY have ALL Radix UI primitives and shadcn components installed. You don't need to install them again. Use them after importing. If you need a new shadcn component, look in `src/components/ui/` first to see if it exists. DO NOT edit the files inside `src/components/ui/` directly; they are considered vendor files.
- **Accessibility:**
    - Always add ARIA labels to icon-only buttons.
    - Ensure keyboard accessibility (focus states, tab order).
    - Use the React `useId()` hook to link form inputs with labels.
- **Dark Mode:** The app defaults to a dark theme. Keep text highly legible (e.g., `text-white` on `bg-gray-900`).
- **Icons:** Use `lucide-react` (already installed).
- **Notifications:** Use the toast notification system (`src/utils/toast.ts`) instead of native browser `alert()`.

## Security & Logging Standards
- **Masking:** Always use `type="password"` for fields handling secrets, tokens, or API keys.
- **Sanitization:**
    - Never log raw error objects or `error.message` from network requests directly to the console.
    - Standardize error handling to sanitize Axios errors (preventing `Authorization` header leakage) before logging or throwing.
    - Sanitize CSV exports by prepending a single quote (`'`) to any field starting with `=`, `+`, `-`, or `@`.

## Pre-Commit Verification
- Always run `bun run lint` and `bun run build` to verify your TypeScript and ESLint rules before submitting changes.
- Ensure any new environment variables or API keys are documented in `README.md`.
