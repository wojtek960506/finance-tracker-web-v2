import { formatPln } from '@vehicles/utils';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Card } from '@shared/ui';

import type { BreakdownCardProps } from './types';

export const BreakdownCard = ({
  title,
  entriesCount,
  totalSpentPln,
  Icon,
  iconClassName,
  linkTo,
  children,
  'data-testid': dataTestId,
}: BreakdownCardProps) => {
  const { t, i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  return (
    <Card className="flex flex-col justify-between p-4" data-testid={dataTestId}>
      <div>
        <div
          className={clsx(
            'flex items-center justify-between gap-2 border-b border-card-border/40',
          )}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={clsx(
                'flex size-8 items-center justify-center rounded-lg',
                iconClassName,
              )}
            >
              <Icon className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-fg">{title}</h3>
              <span className="text-xs text-text-muted">
                {entriesCount} {t('card.entriesCount').toLowerCase()}
              </span>
            </div>
          </div>
          <span className="text-base font-bold text-fg sm:text-lg">
            {formatPln(totalSpentPln, lang)}
          </span>
        </div>

        {children}
      </div>

      <Link
        to={linkTo}
        className={clsx(
          ' inline-flex items-center justify-end gap-2 rounded-xl px-2.5 py-1.5',
          'text-xs font-medium text-text-muted transition-colors',
          'hover:bg-card-border/20 hover:text-fg',
        )}
      >
        <span>
          {t('overview.breakdown.viewSection', {
            section: title,
          })}
        </span>
        <ChevronRight className="size-3.5" />
      </Link>
    </Card>
  );
};
