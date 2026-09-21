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

  if (years > 0 && remMonths > 0) {
    return t('horizonYearsAndMonths', { years, months: remMonths });
  }
  if (years > 0) {
    return t('horizonYearsOnly', { years });
  }
  return t('horizonMonthsOnly', { months: roundedMonths });
};
