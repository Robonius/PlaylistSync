## 2024-05-18 - Replacing `alert()` with Toasts
**Learning:** Native `alert()` calls disrupt user flow and cause blocking dialogs that are poorly received. The existing project structure uses `sonner` via `src/utils/toast.ts` which provides a much smoother interaction pattern for async success states.
**Action:** Always search for `alert()` calls in UI flows and replace them with `showSuccess()` or `showError()` from `src/utils/toast.ts` to improve perceived performance and accessibility.
## 2024-05-18 - InputField component lacked proper id-to-label linking
**Learning:** Found that custom `InputField` wrapper components frequently omit the necessary `id`/`htmlFor` pairing, which severely degrades screen reader experience.
**Action:** Always verify custom input wrappers are using `React.useId()` or similar to automatically generate and link an `id` to the associated `<label>`.
