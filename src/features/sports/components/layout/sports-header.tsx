import clsx from 'clsx';
import { Menu, Plus, Tags, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button, ButtonWithIcon } from '@shared/ui';

import type { SportsHeaderProps } from './types';

export const SportsHeader = ({
  isMobileNavOpen,
  onToggleMobileNav,
  onOpenManageCategories,
  onOpenAddEntry,
}: SportsHeaderProps) => {
  const { t } = useTranslation('sports');

  return (
    <header
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between min-w-0"
      data-testid="sports-header"
    >
      {/* Title & Description */}
      <div className="flex items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight text-fg sm:text-2xl">
            {t('title')}
          </h1>
          <p className="truncate text-xs text-text-muted sm:text-sm">
            {t('description')}
          </p>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="flex sm:hidden items-center gap-1.5 shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={onToggleMobileNav}
            className="p-1.5 text-text-muted hover:text-fg"
            aria-label={
              isMobileNavOpen
                ? t('actions.close', { defaultValue: 'Close navigation' })
                : t('actions.open', { defaultValue: 'Open navigation' })
            }
            data-testid="sports-mobile-nav-toggle"
          >
            {isMobileNavOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        {onOpenManageCategories && (
          <Button
            type="button"
            variant="ghost"
            onClick={onOpenManageCategories}
            className={clsx(
              'inline-flex items-center gap-1.5 rounded-lg border border-border',
              'bg-card-bg px-3 py-1.5 text-xs font-semibold text-text-muted',
              'transition-colors hover:bg-bt-ghost-hover hover:text-fg shadow-xs',
            )}
            data-testid="sports-manage-categories-button"
          >
            <Tags className="size-3.5" />
            <span className="hidden sm:inline">{t('tabs.manageCategories')}</span>
          </Button>
        )}

        {onOpenAddEntry && (
          <ButtonWithIcon
            icon={Plus}
            label={t('entries.newEntry')}
            onClick={onOpenAddEntry}
            className="w-full whitespace-nowrap sm:w-auto"
            data-testid="sports-add-entry-button"
          />
        )}
      </div>
    </header>
  );
};
