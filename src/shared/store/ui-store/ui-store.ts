import { create } from 'zustand';

type UIState = {
  isNavOpen: boolean;
  setIsNavOpen: (val: boolean) => void;
};

export const UI_STORE_KEY = 'ui-store';

export const useUIStore = create<UIState>()((set) => ({
  isNavOpen: false,
  setIsNavOpen: (isNavOpen: boolean) => set({ isNavOpen }),
}));
