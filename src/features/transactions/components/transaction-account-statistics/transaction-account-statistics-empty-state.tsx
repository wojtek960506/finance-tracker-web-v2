import { useTranslation } from 'react-i18next';

import { Card } from '@ui';

export const TransactionAccountStatisticsEmptyState = () => {
  const { t } = useTranslation('transactions');

  return (
    <div className="mx-auto flex w-full max-w-[70rem] flex-col">
      <Card className="gap-4 rounded-3xl border-fg/20 bg-modal-bg/95 p-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold sm:text-2xl">{t('accountStatistics')}</h2>
          <p className="text-sm text-text-muted sm:text-base">
            {t('noAccountStatistics')}
          </p>
        </div>
      </Card>
    </div>
  );
};
