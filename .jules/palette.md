## 2025-02-14 - Add Tooltip to InputField clear button
**Learning:** Icon-only interactive elements (like the 'X' button in inputs) must be wrapped in a Tooltip to provide visible context on hover/focus, to ensure users understand the action before interacting.
**Action:** When adding or reviewing icon-only buttons in custom components, always implement Tooltips and `aria-label`s.

## 2025-02-14 - Add Skip-to-Content Link
**Learning:** When implementing 'skip to content' links in Next.js, the target container (e.g., `<main>`) must have `tabIndex={-1}` to receive programmatic focus without interfering with normal tab order, and `focus-visible:outline-none` to prevent an unsightly focus ring from appearing around the entire page content.
**Action:** When creating main page layouts, always include an accessible skip link and ensure the target element uses these specific attributes/classes for proper focus management without visual degradation.
