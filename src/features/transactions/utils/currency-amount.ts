export const formatDecimal = (value: number, language: string) =>
  new Intl.NumberFormat(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const formatCurrencyAmount = (
  value: number,
  currency: string,
  language: string,
) => `${formatDecimal(value, language)} ${currency}`;
