import { useTranslation } from 'react-i18next';

export const OperationsPage = () => {
  const { t } = useTranslation('investments');

  return (
    <div className="flex flex-col gap-4 py-4" data-testid="operations-page">
      <p className="text-text-muted">{t('tabs.operations')}</p>
    </div>
  );
};
