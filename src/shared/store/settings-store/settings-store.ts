import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SettingsState = {
  baseCurrency: string;
  setBaseCurrency: (baseCurrency: string) => void;
};

export const SETTINGS_STORE_KEY = 'settings-store';
export const DEFAULT_BASE_CURRENCY = 'PLN';

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      baseCurrency: DEFAULT_BASE_CURRENCY,
      setBaseCurrency: (baseCurrency: string) => set({ baseCurrency }),
    }),
    { name: SETTINGS_STORE_KEY },
  ),
);
