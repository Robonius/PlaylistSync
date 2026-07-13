## 2024-05-24 - Form Validation & Independent Loading Insight
**Learning:** Native HTML5 `required` attributes on multiple inputs block submission unless ALL are filled, conflicting with use cases where providing *at least one* input is valid (like independent playlist loading).
**Action:** Remove native `required` from such fields. Use button disabled states paired with Tooltips to explain requirements *before* submission, falling back to programmatic validation for keyboard (Enter) submits.
