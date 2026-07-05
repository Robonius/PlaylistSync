import Papa from 'papaparse';

const sanitizeValue = (value: unknown): unknown => {
  if (typeof value === 'string' && /^[=+\-@\t\r]/.test(value)) {
    return `'${value}`;
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  } else if (typeof value === 'object' && value !== null) {
    const sanitizedObj: Record<string, unknown> = {};
    const objValue = value as Record<string, unknown>;
    for (const key in objValue) {
      if (Object.prototype.hasOwnProperty.call(objValue, key)) {
        sanitizedObj[key] = sanitizeValue(objValue[key]);
      }
    }
    return sanitizedObj;
  }
  return value;
};

const sanitizeData = <T extends Record<string, unknown>>(data: T[]): Record<string, unknown>[] => {
  return data.map((item) => sanitizeValue(item) as Record<string, unknown>);
};

const exportToCSV = <T extends Record<string, unknown>>(data: T[], filename: string): void => {
  const sanitizedData = sanitizeData(data);
  const csv = Papa.unparse(sanitizedData as unknown as unknown[]);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export { exportToCSV };
