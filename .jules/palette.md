## 2025-02-14 - Add Tooltip to InputField clear button
**Learning:** Icon-only interactive elements (like the 'X' button in inputs) must be wrapped in a Tooltip to provide visible context on hover/focus, to ensure users understand the action before interacting.
**Action:** When adding or reviewing icon-only buttons in custom components, always implement Tooltips and `aria-label`s.
## 2025-02-18 - Skip-to-content links in Next.js Apps
**Learning:** When adding a "skip to main content" link to improve keyboard accessibility (allowing users to bypass repetitive navigation), it's crucial that the target container (e.g., `<main id="main-content">`) receives programmatic focus without breaking visual flow.
**Action:** Always ensure the target container has `tabIndex={-1}` (so it doesn't enter the normal tab sequence but can receive focus from the anchor link) and a class like `focus-visible:outline-none` (so it doesn't display an unexpected focus ring when jumped to).

## 2025-03-04 - Truncated Text Accessibility
**Learning:** When using `truncate` (CSS `text-overflow: ellipsis`) to limit text width in tables or small containers, the full text becomes inaccessible to users reading visually if it overflows. Screen readers can still read the text node, but sighted users lose context.
**Action:** Always add a `title` attribute matching the content when applying text truncation classes so users can hover to reveal the full content.
