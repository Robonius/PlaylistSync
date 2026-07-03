import Papa from 'papaparse';

const sanitizeValue = (value: any): any => {
  if (typeof value === 'string' && /^[=+\-@\t\r]/.test(value)) {
    return `'${value}`;
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  } else if (typeof value === 'object' && value !== null) {
    const sanitizedObj: any = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        sanitizedObj[key] = sanitizeValue(value[key]);
      }
    }
    return sanitizedObj;
  }
  return value;
};

const sanitizeData = (data: any[]) => {
  return data.map(sanitizeValue);
};

const exportToCSV = (data: any[], filename: string) => {
  const sanitizedData = sanitizeData(data);
  const csv = Papa.unparse(sanitizedData);
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
