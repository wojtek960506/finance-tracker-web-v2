export const readLocalStorage = <T>(
  key: string,
  defaultValue: T | null = null
): T | null => {

  if (typeof window === "undefined") return defaultValue;

  const rawValue = window.localStorage.getItem(key);
  if (rawValue === null) return defaultValue;

  // Method used to get snapshot should return stable reference,
  // becase otherwise there might be unnecessary renders. So parsed JSON
  // value for object is not correct because it will always be new reference.
  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return defaultValue;
  }
};
