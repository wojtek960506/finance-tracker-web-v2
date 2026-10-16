export const formatDateOnly = (dateStr: string): string => {
  if (!dateStr) return '';
  return dateStr.split('T')[0] ?? '';
};

export const getDateWindow = (
  dateStr: string,
  days = 3,
): { startDate: string; endDate: string } => {
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) {
    const fallback = formatDateOnly(dateStr);
    return { startDate: fallback, endDate: fallback };
  }

  const start = new Date(parsed);
  start.setDate(start.getDate() - days);

  const end = new Date(parsed);
  end.setDate(end.getDate() + days);

  return {
    startDate: start.toISOString().split('T')[0] ?? '',
    endDate: end.toISOString().split('T')[0] ?? '',
  };
};

export const isTransportCategory = (categoryName?: string): boolean => {
  if (!categoryName) return false;
  const normalized = categoryName.trim().toLowerCase();
  return (
    normalized === 'transport' ||
    normalized === 'transportation' ||
    normalized === 'komunikacja' ||
    normalized === 'motoryzacja' ||
    normalized === 'auto' ||
    normalized === 'car'
  );
};
