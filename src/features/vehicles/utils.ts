export const formatPln = (amount: number, language = 'en'): string => {
  return `${new Intl.NumberFormat(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)} PLN`;
};

export const formatKm = (km: number | null | undefined, language = 'en'): string => {
  if (km === null || km === undefined) return '-';
  return `${new Intl.NumberFormat(language, {
    maximumFractionDigits: 0,
  }).format(km)} km`;
};

export const formatLiters = (liters: number, language = 'en'): string => {
  return `${new Intl.NumberFormat(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(liters)} L`;
};

export const formatConsumption = (
  consumption: number | null | undefined,
  language = 'en',
): string => {
  if (consumption === null || consumption === undefined) return '-';
  return `${new Intl.NumberFormat(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(consumption)} L/100km`;
};

export const formatCostPerKm = (
  cost: number | null | undefined,
  language = 'en',
): string => {
  if (cost === null || cost === undefined) return '-';
  return `${new Intl.NumberFormat(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cost)} PLN/km`;
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

export const formatUnitPrice = (
  price: number | null | undefined,
  language = 'en',
): string => {
  if (price === null || price === undefined) return '-';
  return `${new Intl.NumberFormat(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)} PLN/L`;
};

export const formatDeltaKm = (
  delta: number | null | undefined,
  language = 'en',
): string => {
  if (delta === null || delta === undefined) return '-';
  return `+${new Intl.NumberFormat(language, {
    maximumFractionDigits: 0,
  }).format(delta)} km`;
};
