## 2024-03-20 - [Avoid Nesting Interactive Elements (Button inside Label)]
**Learning:** Placing an interactive `<Button>` inside an HTML `<label>` is a WCAG violation (nested interactive controls). It can cause assistive technologies to fail to interact with the button correctly and can lead to double-triggering events (one click on the button, one on the label).
**Action:** When creating a custom file upload button, trigger the hidden `<input type="file">` programmatically via the button's `onClick` handler (e.g., `document.getElementById('csv-upload')?.click()`) instead of wrapping the button in a `<label>`.

## 2026-07-03 - [Specific Loading States for Multi-Action UIs]
**Learning:** Using a single global `isLoading` boolean for a complex form with multiple distinct async actions (like "Sync" vs "Transfer") creates a confusing user experience where all buttons appear to trigger at once or lose context. Preserving button width and text while loading provides a smoother, less jittery UI.
**Action:** Always split generic loading states into specific, actionable states (e.g., `isSyncing`, `isTransferring`) to provide targeted visual feedback on the exact element the user interacted with, retaining text alongside spinners.

## 2026-07-04 - [Clearable Input Fields for Long Strings]
**Learning:** When users are expected to paste or edit long strings (such as URLs), having to manually select and delete the text is tedious. Providing a quick "clear" button inside the input field significantly reduces friction and improves usability.
**Action:** Always consider adding a clear button (e.g., an 'X' icon) to text inputs that frequently handle long values. Ensure the button is only visible when the input has a value, has proper padding to prevent text overlap, and is accessible (using `aria-label`, `type="button"`, and keyboard focus styling).
