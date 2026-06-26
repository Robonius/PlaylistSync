## 2024-06-26 - [Fix CSV Injection Vulnerability]
**Vulnerability:** CSV/Formula Injection vulnerability in `exportToCSV` utility (`src/utils/csvExport.ts`). Data fields starting with `=`, `+`, `-`, `@`, `\t`, or `\r` were not sanitized before being parsed by `papaparse`.
**Learning:** `papaparse`'s `unparse` method doesn't automatically mitigate formula injection for spreadsheet applications like Excel. Both arrays of arrays and arrays of objects must be sanitized.
**Prevention:** Always prepend a single quote (`'`) to string fields starting with malicious characters before exporting to CSV. Ensure sanitization logic can handle various nested data structures.
