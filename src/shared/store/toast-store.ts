import { create } from 'zustand';

type ToastVariant = 'error' | 'success' | 'info';

export type Toast = {
  id: string;
  title?: string;
  message: string;
  variant?: ToastVariant;
  visibilityTime?: number;
};

type ToastState = {
  toasts: Toast[];
  pushToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
};

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  pushToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: crypto.randomUUID(), variant: 'info', visibilityTime: 5, ...toast },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
