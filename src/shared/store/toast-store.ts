import type { ReactNode } from 'react';
import { create } from 'zustand';

type ToastVariant = 'error' | 'success' | 'info';

export type Toast = {
  id: string;
  title?: ReactNode;
  message?: ReactNode;
  variant?: ToastVariant;
  visibilityTime?: number;
};

type ToastState = {
  toasts: Toast[];
  pushToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
};

// LAN HTTP hosts are not treated like localhost secure contexts,
// so randomUUID can be missing there.
export const createToastId = () => {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));

    // Shape the random bytes into an RFC 4122 version 4 UUID.
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const segments = [
      Array.from(bytes.slice(0, 4)),
      Array.from(bytes.slice(4, 6)),
      Array.from(bytes.slice(6, 8)),
      Array.from(bytes.slice(8, 10)),
      Array.from(bytes.slice(10, 16)),
    ];

    return segments
      .map((segment) =>
        segment.map((value) => value.toString(16).padStart(2, '0')).join(''),
      )
      .join('-');
  }

  return `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  pushToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: createToastId(), variant: 'info', visibilityTime: 5, ...toast },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
