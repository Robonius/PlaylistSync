import Papa from 'papaparse';

export const importFromCSV = (file: File): Promise<Record<string, unknown>[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as Record<string, unknown>[]);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};
