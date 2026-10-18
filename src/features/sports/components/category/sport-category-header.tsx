import clsx from 'clsx';
import { Plus, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ButtonWithIcon, Card } from '@shared/ui';

import { getCategoryColor, getCategoryDisplayName } from '../../utils';

import type { SportCategoryHeaderProps } from './types';

export const SportCategoryHeader = ({
  category,
  categoryStats,
  colorIndex = 0,
  onAddActivity,
  isLoading,
  'data-testid': testId = 'sport-category-header',
}: SportCategoryHeaderProps) => {
  const { t } = useTranslation('sports');

  if (isLoading || !category) {
    return (
      <Card
        className="flex flex-row items-center justify-between p-4 sm:p-5 animate-pulse"
        data-testid={`${testId}-loading`}
      >
        <div className="flex items-center gap-3">
          <div className="size-4 rounded-full bg-card-border/40" />
          <div className="flex flex-col gap-1.5">
            <div className="h-5 w-36 rounded bg-card-border/40" />
            <div className="h-3.5 w-20 rounded bg-card-border/30" />
          </div>
        </div>
        {onAddActivity && <div className="h-8 w-28 rounded bg-card-border/40" />}
      </Card>
    );
  }

  const displayName = getCategoryDisplayName(category, t);
  const color = getCategoryColor(colorIndex);
  const isSystem = category.type === 'system';

  return (
    <Card
      className={clsx(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        'p-4 sm:p-5',
      )}
      data-testid={testId}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Color accent circle */}
        <span
          className="size-3.5 sm:size-4 shrink-0 rounded-full shadow-xs"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight text-fg truncate sm:text-xl">
              {displayName}
            </h2>

            {category.isFavorite && (
              <Star
                className="size-4 text-amber-500 fill-amber-500 shrink-0"
                aria-label={t('categories.favorites')}
                data-testid="category-favorite-star"
              />
            )}

            <span
              className={clsx(
                'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider',
                isSystem
                  ? 'bg-blue-500/10 text-blue-500'
                  : 'bg-emerald-500/10 text-emerald-500',
              )}
            >
              {isSystem ? t('categories.system') : t('categories.custom')}
            </span>
          </div>

          {categoryStats?.percentage !== undefined && (
            <p className="text-xs text-text-muted mt-0.5">
              {t('stats.spendingShare')}: {categoryStats.percentage}%
            </p>
          )}
        </div>
      </div>

      {onAddActivity && (
        <div className="flex items-center shrink-0">
          <ButtonWithIcon
            icon={Plus}
            label={t('entries.newEntry')}
            onClick={onAddActivity}
            className="w-full whitespace-nowrap sm:w-auto text-xs sm:text-sm"
            data-testid="category-add-activity-button"
          />
        </div>
      )}
    </Card>
  );
};
