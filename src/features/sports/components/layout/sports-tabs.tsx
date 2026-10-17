import clsx from 'clsx';
import { LayoutDashboard, Plus, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { getCategoryDisplayName } from '../../utils';

import type { SportsTabsProps } from './types';

export const SportsTabs = ({
  categories,
  isMobileNavOpen,
  onCloseMobileNav,
  onOpenManageCategories,
}: SportsTabsProps) => {
  const { t } = useTranslation('sports');

  // Sorted categories: favorites first, then alphabetically
  const sortedCategories = [...categories].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <>
      {/* Desktop Horizontal Tabs */}
      <nav
        aria-label="Sports sub-navigation"
        className={clsx(
          'hidden sm:flex items-center gap-1.5 border-b border-border pb-2 sm:gap-2',
          'overflow-x-auto',
        )}
        data-testid="sports-tabs"
      >
        {/* Overall Tab */}
        <NavLink
          to="/sports"
          end
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium',
              'whitespace-nowrap transition-colors sm:text-sm shrink-0',
              isActive
                ? 'bg-fg text-bg shadow-sm'
                : 'text-text-muted hover:bg-bt-ghost-hover hover:text-fg',
            )
          }
          data-testid="sports-tab-overall"
        >
          <LayoutDashboard className="size-4 shrink-0" />
          <span>{t('tabs.overall')}</span>
        </NavLink>

        {/* Dynamic Category Tabs */}
        {sortedCategories.map((category) => {
          const displayName = getCategoryDisplayName(category, t);
          const categoryPath = `/sports/categories/${category.id}`;

          return (
            <NavLink
              key={category.id}
              to={categoryPath}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium',
                  'whitespace-nowrap transition-colors sm:text-sm shrink-0',
                  isActive
                    ? 'bg-fg text-bg shadow-sm'
                    : 'text-text-muted hover:bg-bt-ghost-hover hover:text-fg',
                )
              }
              data-testid={`sports-tab-category-${category.id}`}
            >
              {category.isFavorite && (
                <Star
                  className="size-3 shrink-0 text-amber-500 fill-amber-500"
                  aria-label={t('categories.favorites')}
                />
              )}
              <span>{displayName}</span>
            </NavLink>
          );
        })}

        {/* Add/Manage Category Quick Button */}
        {onOpenManageCategories && (
          <button
            type="button"
            onClick={onOpenManageCategories}
            className={clsx(
              'flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium',
              'text-text-muted hover:bg-bt-ghost-hover hover:text-fg transition-colors',
              'whitespace-nowrap shrink-0 border border-dashed border-border',
            )}
            title={t('categories.addCategory')}
            data-testid="sports-tab-add-category"
          >
            <Plus className="size-3.5" />
            <span>{t('categories.addCategory')}</span>
          </button>
        )}
      </nav>

      {/* Mobile Collapsible Navigation */}
      {isMobileNavOpen && (
        <nav
          aria-label="Sports mobile sub-navigation"
          className={clsx(
            'flex flex-col gap-1 rounded-2xl border border-border bg-card-bg/95 p-2',
            'backdrop-blur-md shadow-sm sm:hidden',
          )}
          data-testid="sports-mobile-nav"
        >
          {/* Overall Mobile Tab */}
          <NavLink
            to="/sports"
            end
            onClick={onCloseMobileNav}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold',
                'transition-colors',
                isActive
                  ? 'bg-fg text-bg shadow-xs'
                  : 'text-text-muted hover:bg-muted hover:text-fg',
              )
            }
          >
            <LayoutDashboard className="size-4 shrink-0" />
            <span>{t('tabs.overall')}</span>
          </NavLink>

          {/* Dynamic Mobile Categories */}
          {sortedCategories.map((category) => {
            const displayName = getCategoryDisplayName(category, t);
            const categoryPath = `/sports/categories/${category.id}`;

            return (
              <NavLink
                key={category.id}
                to={categoryPath}
                onClick={onCloseMobileNav}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold',
                    'transition-colors',
                    isActive
                      ? 'bg-fg text-bg shadow-xs'
                      : 'text-text-muted hover:bg-muted hover:text-fg',
                  )
                }
              >
                {category.isFavorite && (
                  <Star className="size-3.5 shrink-0 text-amber-500 fill-amber-500" />
                )}
                <span>{displayName}</span>
              </NavLink>
            );
          })}
        </nav>
      )}
    </>
  );
};
