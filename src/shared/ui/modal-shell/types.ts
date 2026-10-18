import type { ReactNode } from 'react';

export interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  testId?: string;
  children: ReactNode;
}
