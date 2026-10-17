import { useTranslation } from 'react-i18next';

import { SportsLayout } from '../layout';

export const SportsOverviewContent = () => {
  const { t } = useTranslation('sports');

  return (
    <div className="flex flex-col gap-4 pb-6" data-testid="sports-overview-content">
      <div className="rounded-xl border border-border bg-card-bg p-6 text-fg">
        <h2 className="text-lg font-semibold">{t('tabs.overall')}</h2>
        <p className="text-sm text-text-muted mt-1">{t('stats.emptyStats')}</p>
      </div>
    </div>
  );
};

export const SportsOverviewPage = () => {
  return (
    <SportsLayout>
      <SportsOverviewContent />
    </SportsLayout>
  );
};
