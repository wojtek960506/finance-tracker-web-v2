import { useSyncExternalStore } from "react";


const LOCAL_STORAGE_CHANGE_EVENT = "local-storage-change";

const readLocalStorageValue = <T>(key: string, defaultValue: T | null): T | null => {

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

export const useLocalStorage = <T>(key: string, defaultValue: T | null = null) => {
  const subscribe = (onStoreChange: () => void) => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key) onStoreChange();
    };

    const handleLocalStorageChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ key?: string }>;
      if (customEvent.detail?.key === key) onStoreChange();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleLocalStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleLocalStorageChange);
    };
  };

  const getSnapshot = () => readLocalStorageValue<T>(key, defaultValue);
  const item = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const setItem = (value: T | null) => {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(
      new CustomEvent(LOCAL_STORAGE_CHANGE_EVENT, { detail: { key } })
    );
  };

  const removeItem = () => {
    window.localStorage.removeItem(key);
    window.dispatchEvent(
      new CustomEvent(LOCAL_STORAGE_CHANGE_EVENT, { detail: { key } })
    );
  };

  return { item, setItem, removeItem };
};
