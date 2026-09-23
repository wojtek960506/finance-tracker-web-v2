export const formatDecimal = (value: number, language: string): string =>
  new Intl.NumberFormat(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const formatCurrencyAmount = (
  value: number,
  currency: string | undefined,
  language: string,
): string => `${formatDecimal(value, language)}${currency ? ` ${currency}` : ''}`;

export const formatPercentage = (value: number, language: string): string =>
  new Intl.NumberFormat(language, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value);

export const formatHorizonYearsAndMonths = (
  months: number,
  t: (key: string, options?: Record<string, unknown>) => string,
): string => {
  const roundedMonths = Math.round(months);
  const years = Math.floor(roundedMonths / 12);
  const remMonths = roundedMonths % 12;

  const yearsStr = years > 0 ? t('years', { count: years }) : '';
  const monthsStr = remMonths > 0 ? t('months', { count: remMonths }) : '';

  if (yearsStr && monthsStr) {
    return `${yearsStr} ${monthsStr}`;
  }
  if (yearsStr) {
    return yearsStr;
  }
  return t('months', { count: roundedMonths });
};
