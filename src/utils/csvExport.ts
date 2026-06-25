import Papa from 'papaparse';

const sanitizeData = (data: any[]) => {
  return data.map((row) => {
    if (Array.isArray(row)) {
      return row.map((value) => {
        if (typeof value === 'string' && /^[=+\-@]/.test(value)) {
          return `'${value}`;
        }
        return value;
      });
    } else if (typeof row === 'object' && row !== null) {
      const sanitizedRow: any = {};
      for (const key in row) {
        if (Object.prototype.hasOwnProperty.call(row, key)) {
          let value = row[key];
          if (typeof value === 'string' && /^[=+\-@]/.test(value)) {
            value = `'${value}`;
          }
          sanitizedRow[key] = value;
        }
      }
      return sanitizedRow;
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