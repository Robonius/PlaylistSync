## 2024-03-20 - [Avoid Nesting Interactive Elements (Button inside Label)]
**Learning:** Placing an interactive `<Button>` inside an HTML `<label>` is a WCAG violation (nested interactive controls). It can cause assistive technologies to fail to interact with the button correctly and can lead to double-triggering events (one click on the button, one on the label).
**Action:** When creating a custom file upload button, trigger the hidden `<input type="file">` programmatically via the button's `onClick` handler (e.g., `document.getElementById('csv-upload')?.click()`) instead of wrapping the button in a `<label>`.

## 2026-07-03 - [Specific Loading States for Multi-Action UIs]
**Learning:** Using a single global `isLoading` boolean for a complex form with multiple distinct async actions (like "Sync" vs "Transfer") creates a confusing user experience where all buttons appear to trigger at once or lose context. Preserving button width and text while loading provides a smoother, less jittery UI.
**Action:** Always split generic loading states into specific, actionable states (e.g., `isSyncing`, `isTransferring`) to provide targeted visual feedback on the exact element the user interacted with, retaining text alongside spinners.

## 2026-07-04 - [Clearable Input Fields for Long Strings]
**Learning:** When users are expected to paste or edit long strings (such as URLs), having to manually select and delete the text is tedious. Providing a quick "clear" button inside the input field significantly reduces friction and improves usability.
**Action:** Always consider adding a clear button (e.g., an 'X' icon) to text inputs that frequently handle long values. Ensure the button is only visible when the input has a value, has proper padding to prevent text overlap, and is accessible (using `aria-label`, `type="button"`, and keyboard focus styling).

## 2026-07-05 - [Accessible Tooltips on Disabled Buttons]
**Learning:** Native `<button disabled>` elements (or components resolving to them, like Radix UI/Shadcn buttons) have `pointer-events: none` applied by default. This prevents hover and focus events from firing, which breaks tooltips attached directly to the disabled button.
**Action:** When adding a tooltip to a disabled button, wrap the button in a `<div>` or `<span>` with `tabIndex={0}` and any necessary layout classes (e.g., `w-full`, focus ring classes). Make sure to pass `asChild` to the `<TooltipTrigger>` to attach the event listeners to the wrapper, enabling the tooltip to show for both mouse hover and keyboard focus even when the inner button is disabled.

## 2026-10-24 - [Native Form Submission for Keyboard Accessibility]
**Learning:** Relying solely on `onClick` for form submission buttons forces keyboard users to manually tab to the button instead of hitting Enter. Wrapping inputs and the primary action button in a standard `<form>` restores native keyboard submission behaviors.
**Action:** Always wrap logical groups of inputs and their submission button in a `<form>` with an `onSubmit` handler, even in Single Page Applications, to preserve native Enter key functionality.

## 2026-10-24 - [Semantic Meaning for Visual Status Indicators]
**Learning:** Purely visual status indicators (like colored dots in tables) are completely ignored by screen readers, creating an information gap for visually impaired users.
**Action:** Always add semantic meaning to visual-only indicators by either including a `title`/`aria-label` attribute or embedding a screen-reader-only text element (e.g., `<span className="sr-only">Status</span>`) inside the visual component.
## 2024-02-17 - Fix Shadcn `<Button>` and Next.js `<Link>` Nesting
**Learning:** Placing a Next.js `<Link>` element around or inside a standard Shadcn `<Button>` component can result in invalid HTML nesting (e.g., `<button>` inside `<a>`) which is poor for both standard compliance and screen readers. Additionally, icon-only buttons need visible tooltips alongside their `sr-only` text or `aria-label` for mouse users, and internal SVGs should have `aria-hidden="true"`.
**Action:** Use Shadcn UI's `asChild` prop on the `<Button>` component, then place the Next.js `<Link>` immediately inside it. Wrap the entire structure inside a `<Tooltip>` system when the button only contains an icon.
