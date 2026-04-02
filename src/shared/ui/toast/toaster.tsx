import clsx from 'clsx';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import { useEffect } from 'react';

import { type Toast, useToastStore } from '@store/toast-store';

import { Button } from '../button';
import { Card } from '../card';

const TOAST_ICON = {
  error: CircleAlert,
  success: CircleCheck,
  info: Info,
} as const;

const TOAST_STYLES = {
  error: 'border-destructive-border bg-destructive text-text',
  success: 'border-bt-primary-border bg-bt-primary text-text',
  info: 'border-bt-secondary-border bg-bt-secondary text-text',
} as const;

const ToastItem = (
  { id, title, message, variant = 'info', visibilityTime = 5 }: Toast,
) => {
  const removeToast = useToastStore((state) => state.removeToast);
  const Icon = TOAST_ICON[variant];

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      removeToast(id);
    }, visibilityTime * 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [id, removeToast, visibilityTime]);

  return (
    <Card
      role="status"
      aria-live="polite"
      className={clsx(
        'w-full max-w-sm flex-row items-start justify-between gap-3 border shadow-lg',
        TOAST_STYLES[variant],
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 size-5 shrink-0" />
        <div className="min-w-0">
          {title ? <p className="font-semibold">{title}</p> : null}
          <p className="break-words text-sm sm:text-base">{message}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        className="p-0 sm:p-0 h-auto self-start"
        onClick={() => removeToast(id)}
        aria-label="Dismiss notification"
      >
        <X className="size-4 sm:size-5" />
      </Button>
    </Card>
  );
};

export const Toaster = () => {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[120] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem {...toast} />
        </div>
      ))}
    </div>
  );
};
