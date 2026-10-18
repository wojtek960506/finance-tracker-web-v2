import type { SportCategory, SportEntry } from '../../api';
import type { SportEntryFormValues } from '../../schemas';

export interface SportActivityFormProps {
  categories: SportCategory[];
  defaultValues?: Partial<SportEntryFormValues>;
  isPending?: boolean;
  isCategoryDisabled?: boolean;
  mode: 'create' | 'update';
  onSubmit: (values: SportEntryFormValues) => Promise<void> | void;
  onCancel: () => void;
  onAddNewCategory?: () => void;
}

export interface CreateSportActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: SportCategory[];
  defaultCategoryId?: string;
  isCategoryDisabled?: boolean;
  onSuccess?: (item: SportEntry) => void;
}

export interface UpdateSportActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: SportCategory[];
  item: SportEntry | null;
  onSuccess?: (item: SportEntry) => void;
}

export interface DeleteSportActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: SportEntry | null;
  onSuccess?: () => void;
}
