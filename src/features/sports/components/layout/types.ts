import type { ReactNode } from 'react';

import type { SportCategory } from '../../api/types';

export interface SportsLayoutProps {
  children?: ReactNode;
  onOpenAddEntry?: () => void;
}

export interface SportsHeaderProps {
  hasNavigation?: boolean;
  isMobileNavOpen: boolean;
  onToggleMobileNav: () => void;
  onOpenManageCategories?: () => void;
  onOpenAddEntry?: () => void;
}

export interface SportsTabsProps {
  categories: SportCategory[];
  isLoading?: boolean;
  isMobileNavOpen: boolean;
  onCloseMobileNav: () => void;
  onOpenManageCategories?: () => void;
}
