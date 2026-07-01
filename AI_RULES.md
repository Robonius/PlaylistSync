# Tech Stack

- You are building a Next.js 15 (App Router) application using Bun as the runtime and package manager.
- Use TypeScript (strict typing preferred).
- Use App Router conventions. Pages and layouts live in `src/app/`.
- Always put source code in the `src` folder.
- Reusable components go in `src/components/`.
- Utility functions (API calls, parsers) go in `src/utils/`.
- ALWAYS try to use the shadcn/ui library.
- Docker / Docker Compose: use for environment consistency.
- Tailwind CSS: always use Tailwind CSS for styling components. Utilize Tailwind classes extensively for layout, spacing, colors, and other design aspects.
- Package Manager: Strictly use `bun`. The use of `pnpm`, `npm`, or `yarn` is strictly avoided.

# UI/UX & Security Standards

- Accessibility: add ARIA labels to icon-only buttons and ensure keyboard accessibility (focus states, tab order).
- Credential Masking: use `type="password"` for all sensitive input fields (secrets, tokens, API keys).
- Logging: sanitize error logs; never log raw Axios errors or sensitive headers.
- CSV Export: sanitize data fields to prevent formula injection by prepending a single quote (`'`) to any field starting with `=`, `+`, `-`, or `@`.
- Use the React `useId()` hook to link form inputs with labels.
- Use the toast notification system (`src/utils/toast.ts`) instead of native browser `alert()`.

# Available packages and libraries

- The `lucide-react` package is installed for icons.
- You ALREADY have ALL the shadcn/ui components and their dependencies installed. So you don't need to install them again.
- You have ALL the necessary Radix UI components installed.
- Use prebuilt components from the shadcn/ui library after importing them. Note that these files shouldn't be edited, so make new components if you need to change them.
