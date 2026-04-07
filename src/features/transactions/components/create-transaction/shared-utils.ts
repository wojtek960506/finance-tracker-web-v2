export const FIELD_CONTROL_CLASS_NAME = 'rounded-xl px-3 py-2 text-base sm:text-lg';

export const getDefaultTransactionDate = () => new Date().toISOString().slice(0, 10);

export const toOptionalTrimmedString = (value: string) => {
  const trimmedValue = value.trim();
  return trimmedValue === '' ? undefined : trimmedValue;
};
