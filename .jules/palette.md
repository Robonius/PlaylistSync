## 2025-02-14 - Add Tooltip to InputField clear button
**Learning:** Icon-only interactive elements (like the 'X' button in inputs) must be wrapped in a Tooltip to provide visible context on hover/focus, to ensure users understand the action before interacting.
**Action:** When adding or reviewing icon-only buttons in custom components, always implement Tooltips and `aria-label`s.
## 2025-02-18 - Skip-to-content links in Next.js Apps
**Learning:** When adding a "skip to main content" link to improve keyboard accessibility (allowing users to bypass repetitive navigation), it's crucial that the target container (e.g., `<main id="main-content">`) receives programmatic focus without breaking visual flow.
**Action:** Always ensure the target container has `tabIndex={-1}` (so it doesn't enter the normal tab sequence but can receive focus from the anchor link) and a class like `focus-visible:outline-none` (so it doesn't display an unexpected focus ring when jumped to).
## 2025-02-18 - Native tooltips for truncated text
**Learning:** When using CSS text truncation (e.g., `text-overflow: ellipsis` or Tailwind's `truncate`) to fit content within tight UI constraints, the hidden portion of the text becomes completely inaccessible to sighted users who cannot inspect the DOM.
**Action:** Always provide a native `title` attribute matching the full text on any element that applies text truncation, ensuring the complete content remains accessible via browser tooltips on hover.
