import type { ReactNode } from 'react';

import type { ButtonVariant } from '../button';

export interface DeleteRecordModalProps<T = unknown> {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isPending?: boolean;
  title: string;
  prompt: string;
  hint?: string;
  hintClassName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  testIdPrefix: string;
  confirmVariant?: ButtonVariant;
  item?: T | null;
  children?: ReactNode | ((item: T) => ReactNode);
}
