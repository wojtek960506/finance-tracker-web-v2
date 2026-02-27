import { useEffect, useState } from "react";


export const useLocalStorage = <T>(key: string, defaultValue: T | null = null) => {
  const [value, setValue] = useState<T | null>(() => {
    const tmp = localStorage.getItem(key);
    if (tmp !== null) return JSON.parse(tmp) as T;
    return defaultValue;
  });

  // cross-tab sync
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        setValue(JSON.parse(event.newValue));
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key]);

  const setItem = (val: T | null) => {
    localStorage.setItem(key, JSON.stringify(val));
    setValue(val);
    console.log("mama")
  }

  const removeItem = () => {
    localStorage.removeItem(key);
    setValue(defaultValue);
  }

  return { item: value, setItem, removeItem };
}
