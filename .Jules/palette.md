## 2024-05-24 - Form Validation & Independent Loading Insight
**Learning:** Native HTML5 `required` attributes on multiple inputs block submission unless ALL are filled, conflicting with use cases where providing *at least one* input is valid (like independent playlist loading).
**Action:** Remove native `required` from such fields. Use button disabled states paired with Tooltips to explain requirements *before* submission, falling back to programmatic validation for keyboard (Enter) submits.
## 2024-03-24 - Add skip-to-content link for keyboard accessibility
**Learning:** Adding a "skip to content" link requires the target container (like `<main>`) to have `tabIndex={-1}` so it can receive programmatic focus without interfering with regular tab order. Additionally, applying `focus-visible:outline-none` prevents an unsightly default focus ring from appearing around the entire page content when the skip link is used in Next.js applications.
**Action:** When implementing skip links, always ensure the target container is programmatically focusable (`tabIndex={-1}`) and visually clean (`focus-visible:outline-none`).
