## 2024-05-18 - Replacing `alert()` with Toasts
**Learning:** Native `alert()` calls disrupt user flow and cause blocking dialogs that are poorly received. The existing project structure uses `sonner` via `src/utils/toast.ts` which provides a much smoother interaction pattern for async success states.
**Action:** Always search for `alert()` calls in UI flows and replace them with `showSuccess()` or `showError()` from `src/utils/toast.ts` to improve perceived performance and accessibility.
