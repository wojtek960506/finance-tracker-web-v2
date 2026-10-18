import { Activity, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ButtonWithIcon, Card } from '@shared/ui';

export interface SportsOverviewEmptyStateProps {
  onAddActivity?: () => void;
}

export const SportsOverviewEmptyState = ({
  onAddActivity,
}: SportsOverviewEmptyStateProps = {}) => {
  const { t } = useTranslation('sports');

  return (
    <Card
      className="flex flex-col items-center justify-center p-8 text-center sm:p-12"
      data-testid="sports-overview-empty-state"
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/40 text-text-muted mb-4">
        <Activity className="size-7" />
      </div>
      <h3 className="text-base font-bold text-fg sm:text-lg">{t('stats.emptyStats')}</h3>
      <p className="mt-1.5 max-w-md text-xs text-text-muted sm:text-sm">
        {t('entries.empty')}
      </p>
      {onAddActivity && (
        <ButtonWithIcon
          icon={Plus}
          label={t('entries.newEntry')}
          onClick={onAddActivity}
          className="mt-4"
          data-testid="sports-overview-empty-add-button"
        />
      )}
    </Card>
  );
};
