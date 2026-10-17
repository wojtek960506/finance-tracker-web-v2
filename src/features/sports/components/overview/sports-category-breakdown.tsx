import clsx from 'clsx';
import { ChevronRight, PieChart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Card } from '@shared/ui';

import { formatPln, getCategoryColor, getCategoryDisplayName } from '../../utils';

import type { SportsCategoryBreakdownProps } from './types';

export const SportsCategoryBreakdown = ({
  categories,
  totalCostPln,
}: SportsCategoryBreakdownProps) => {
  const { t, i18n } = useTranslation('sports');
  const lang = i18n.language;

  if (categories.length === 0) {
    return null;
  }

  const sortedCategories = [...categories].sort(
    (a, b) => b.totalCostPln - a.totalCostPln,
  );

  return (
    <Card
      className="flex flex-col gap-3.5 p-4 sm:p-5"
      data-testid="sports-category-breakdown"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PieChart className="size-4 text-text-muted" />
          <h3 className="text-sm font-semibold tracking-tight text-fg sm:text-base">
            {t('stats.categoryBreakdown')}
          </h3>
        </div>
        <span className="text-xs text-text-muted font-medium">
          {formatPln(totalCostPln, lang)}
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {sortedCategories.map((category, index) => {
          const color = getCategoryColor(index);
          const displayName = getCategoryDisplayName(
            {
              name: category.categoryName,
              type: category.type,
              categoryKey: category.categoryKey,
            },
            t,
          );

          return (
            <Link
              key={category.categoryId}
              to={`/sports/categories/${category.categoryId}`}
              className={clsx(
                'group flex flex-col gap-1.5 rounded-xl border border-transparent p-2.5',
                'transition-all hover:border-border hover:bg-bt-ghost-hover hover:shadow-xs',
              )}
              data-testid={`category-breakdown-row-${category.categoryId}`}
            >
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="size-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="truncate font-semibold text-fg">{displayName}</span>
                  <span className="text-xs text-text-muted">({category.entryCount})</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-fg">
                    {formatPln(category.totalCostPln, lang)}
                  </span>
                  <span className="w-12 text-right text-xs font-medium text-text-muted">
                    {category.percentage}%
                  </span>
                  <ChevronRight className="size-3.5 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-fg" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted/40">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min(category.percentage, 100)}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
};
