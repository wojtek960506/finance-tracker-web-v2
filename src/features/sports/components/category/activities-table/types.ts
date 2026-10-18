import type { SportEntry } from '../../../api';

export interface SportActivitiesTableProps {
  items: SportEntry[];
  hasFilters: boolean;
  onEditItem?: (item: SportEntry) => void;
  onDeleteItem?: (item: SportEntry) => void;
  onLinkItem?: (item: SportEntry) => void;
  onUnlinkItem?: (item: SportEntry) => void;
  onAddFirstItem?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void | Promise<unknown>;
  totalCount?: number;
  loadedCount?: number;
  'data-testid'?: string;
}

export interface SportActivityTableRowProps {
  item: SportEntry;
  onEdit?: () => void;
  onDelete?: () => void;
  onLink?: () => void;
  onUnlink?: () => void;
}

export interface SportActivityMobileCardProps {
  item: SportEntry;
  onEdit?: () => void;
  onDelete?: () => void;
  onLink?: () => void;
  onUnlink?: () => void;
}

export interface SportActivityItemActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onLink?: () => void;
  onUnlink?: () => void;
  mode?: 'buttons' | 'dropdown';
  className?: string;
  editTestId?: string;
  deleteTestId?: string;
  linkTestId?: string;
  unlinkTestId?: string;
}

export interface SportActivitiesEmptyStateProps {
  hasFilters: boolean;
  onAddFirstItem?: () => void;
}

export interface SportActivitiesPaginationProps {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void | Promise<unknown>;
  totalCount?: number;
  loadedCount?: number;
  testId?: string;
}
