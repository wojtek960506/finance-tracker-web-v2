export const parseDateValue = (value?: string) => {
  if (!value) return undefined;

  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return undefined;

  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export const formatDateValue = (date: Date | undefined, locale: string) => {
  if (!date) return '';

  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
};

export const toInputDateValue = (date: Date | undefined) => {
  if (!date) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};