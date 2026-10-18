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

export const formatPln = (amount: number, language = 'en'): string => {
  return `${new Intl.NumberFormat(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)} PLN`;
};

export const formatDate = (dateStr: string, language = 'en'): string => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
};
