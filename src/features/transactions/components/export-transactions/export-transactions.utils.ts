import { DEFAULT_EXPORT_FILENAME } from '@transactions/api';

export const DEFAULT_EXPORT_FILE_BASE = DEFAULT_EXPORT_FILENAME.replace(/\.csv$/i, '');

const formatExportTimestamp = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
};

export const getExportFilename = (fileBase: string, now = new Date()) => {
  const trimmedFileBase = fileBase.trim();
  const normalizedFileBase = trimmedFileBase.replace(/\.csv$/i, '');
  const safeFileBase = normalizedFileBase || DEFAULT_EXPORT_FILE_BASE;

  return `${safeFileBase}_${formatExportTimestamp(now)}.csv`;
};

export const downloadCsvFile = (csv: Blob, fileName: string) => {
  const objectUrl = window.URL.createObjectURL(csv);
  const link = document.createElement('a');

  link.href = objectUrl;
  link.download = fileName;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
};
