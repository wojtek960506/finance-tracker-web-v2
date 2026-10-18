import type { SportCategory, SportEntry } from '../../api';
import type { SportEntryFormValues } from '../../schemas';

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
