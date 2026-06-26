import Papa from 'papaparse';

const sanitizeField = (field: any): any => {
  if (typeof field === 'string' && /^[=+\-@\t\r]/.test(field)) {
    return `'${field}`;
  }
  return field;
};

const sanitizeData = (data: any[]): any[] => {
  return data.map(row => {
    if (Array.isArray(row)) {
      return row.map(sanitizeField);
    } else if (typeof row === 'object' && row !== null) {
      const newRow: Record<string, any> = {};
      for (const key in row) {
        if (Object.prototype.hasOwnProperty.call(row, key)) {
          newRow[key] = sanitizeField(row[key]);
        }
      }
      return newRow;
    }
    return row;
  });
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