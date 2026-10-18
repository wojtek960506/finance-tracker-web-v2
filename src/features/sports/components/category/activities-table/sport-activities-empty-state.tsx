import clsx from 'clsx';
import { Dumbbell, Plus, SearchX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ButtonWithIcon, Card } from '@shared/ui';

import type { SportActivitiesEmptyStateProps } from './types';

export const SportActivitiesEmptyState = ({
  hasFilters,
  onAddFirstItem,
}: SportActivitiesEmptyStateProps) => {
  const { t } = useTranslation('sports');

  if (hasFilters) {
    return (
      <Card
        className="flex flex-col items-center justify-center py-12 text-center"
        data-testid="activities-empty-matching-filters"
      >
        <div
          className={clsx(
            'flex size-12 items-center justify-center rounded-2xl',
            'bg-muted/40 text-text-muted',
          )}
        >
          <SearchX className="size-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-fg">
          {t('entries.emptyFiltered')}
        </h3>
      </Card>
    );
  }

  return (
    <Card
      className="flex flex-col items-center justify-center py-12 text-center"
      data-testid="activities-empty-state"
    >
      <div
        className={clsx(
          'flex size-12 items-center justify-center rounded-2xl',
          'bg-blue-500/10 text-blue-500',
        )}
      >
        <Dumbbell className="size-6" />
      </div>
      <h3 className="mt-3 text-base font-semibold text-fg">{t('entries.empty')}</h3>
      <p className="mt-1 max-w-sm text-xs text-text-muted">
        {t('entries.emptyDescription')}
      </p>
      {onAddFirstItem && (
        <ButtonWithIcon
          icon={Plus}
          label={t('entries.newEntry')}
          className="mt-4"
          onClick={onAddFirstItem}
          data-testid="activities-empty-create-button"
        />
      )}
    </Card>
  );
};
