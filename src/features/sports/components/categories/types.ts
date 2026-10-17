import type { SportCategory } from '../../api';

export interface SportCategoryItemProps {
  category: SportCategory;
  onDeleteRequest: (category: SportCategory) => void;
}

export interface SportCategoryDeleteModalProps {
  category: SportCategory | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface SportsCategoriesListProps {
  categories: SportCategory[];
  onDeleteRequest: (category: SportCategory) => void;
}
