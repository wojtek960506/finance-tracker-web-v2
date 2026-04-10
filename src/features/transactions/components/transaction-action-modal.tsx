import clsx from 'clsx';
import type { ReactNode, RefObject } from 'react';

import { Button, type ButtonVariant, Modal } from '@ui';

type TransactionActionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  ariaLabel: string;
  title: string;
  cancelLabel: string;
  confirmLabel: string;
  onConfirm: () => void;
  restoreFocusRef?: RefObject<HTMLElement | null>;
  confirmVariant?: ButtonVariant;
  isPending?: boolean;
  confirmDisabled?: boolean;
  tone?: 'default' | 'destructive';
  children: ReactNode;
};

export const TransactionActionModal = ({
  isOpen,
  onClose,
  ariaLabel,
  title,
  cancelLabel,
  confirmLabel,
  onConfirm,
  restoreFocusRef,
  confirmVariant = 'destructive',
  isPending = false,
  confirmDisabled = false,
  tone = 'default',
  children,
}: TransactionActionModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    ariaLabel={ariaLabel}
    restoreFocusRef={restoreFocusRef}
  >
    <div
      className={clsx(
        'flex flex-col gap-4',
        tone === 'destructive' &&
          '-m-3 rounded-2xl bg-destructive/10 p-3 sm:-m-4 sm:rounded-3xl sm:p-4',
      )}
    >
      <div className="flex flex-col gap-2">
        <h2
          className={clsx(
            'text-lg font-semibold',
            tone === 'destructive' && 'text-[var(--color-destructive)]',
          )}
        >
          {title}
        </h2>
        <div className="flex flex-col gap-3">{children}</div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose} disabled={isPending}>
          {cancelLabel}
        </Button>
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
          disabled={isPending || confirmDisabled}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
);
