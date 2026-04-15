import { useSyncExternalStore } from 'react';

import { LOCAL_STORAGE_CHANGE_EVENT } from '@shared/consts';
import { readLocalStorage } from '@shared/utils';

export const useLocalStorage = <T>(key: string, defaultValue: T | null = null) => {
  const subscribe = (onStoreChange: () => void) => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key) onStoreChange();
    };

    const handleLocalStorageChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ key?: string }>;
      if (customEvent.detail?.key === key) onStoreChange();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleLocalStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleLocalStorageChange);
    };
  };

  const getSnapshot = () => readLocalStorage<T>(key, defaultValue);
  const item = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const setItem = (value: T | null) => {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(
      new CustomEvent(LOCAL_STORAGE_CHANGE_EVENT, { detail: { key } }),
    );
  };

  const removeItem = () => {
    window.localStorage.removeItem(key);
    window.dispatchEvent(
      new CustomEvent(LOCAL_STORAGE_CHANGE_EVENT, { detail: { key } }),
    );
  };

  return { item, setItem, removeItem };
};
