import type { ReactNode } from 'react';

import type { SportCategory, SportEntry } from '../../api';
import type { SportEntryFormValues } from '../../schemas';

export interface SportActivityModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  testId?: string;
  children: ReactNode;
}

export interface SportActivityFormActionsProps {
  isPending: boolean;
  onCancel: () => void;
  submitLabel: string;
  submittingLabel?: string;
  cancelLabel?: string;
  submitTestId?: string;
  cancelTestId?: string;
  className?: string;
}

export interface SportActivityFormProps {
  categories: SportCategory[];
  defaultValues?: Partial<SportEntryFormValues>;
  isPending?: boolean;
  mode: 'create' | 'update';
  onSubmit: (values: SportEntryFormValues) => Promise<void> | void;
  onCancel: () => void;
}

export interface CreateSportActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: SportCategory[];
  defaultCategoryId?: string;
  onSuccess?: (item: SportEntry) => void;
}
