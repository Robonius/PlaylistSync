## 2025-02-14 - Add Tooltip to InputField clear button
**Learning:** Icon-only interactive elements (like the 'X' button in inputs) must be wrapped in a Tooltip to provide visible context on hover/focus, to ensure users understand the action before interacting.
**Action:** When adding or reviewing icon-only buttons in custom components, always implement Tooltips and `aria-label`s.

## 2025-02-13 - Form Validation for Independent Optional Inputs
**Learning:** Using native HTML5 `required` attributes on input fields that are mutually inclusive (i.e., at least one must be filled, but not necessarily all) forces users to fill all fields to submit the form, creating friction and blocking valid submissions.
**Action:** Remove native HTML5 `required` properties on such inputs. Instead, manage form validation by disabling the submit button and providing a helpful `<Tooltip>` explaining the condition (e.g., "Please provide at least one playlist URL") when the condition is not met.
