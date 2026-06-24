## 2024-05-14 - Add placeholder attributes to input fields
**Learning:** Adding helpful placeholder text (like example URLs or dot characters for tokens) clarifies the expected input format without cluttering the UI or requiring extra helper text. This is a simple but highly effective micro-UX improvement for configuration-heavy forms.
**Action:** When creating or modifying inputs in forms (especially ones expecting specific formats like URLs or keys), always consider adding placeholder text. Ensure reusable wrapper components (like `InputField`) accept and pass through a `placeholder` prop.
