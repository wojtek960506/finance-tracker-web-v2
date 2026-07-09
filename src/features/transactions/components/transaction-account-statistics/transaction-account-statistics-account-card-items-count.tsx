import { useTranslation } from 'react-i18next';

type TransactionAccountStatisticsAccountCardItemsCountProps = {
  totalItems: number;
};

export const TransactionAccountStatisticsAccountCardItemsCount = ({
  totalItems,
}: TransactionAccountStatisticsAccountCardItemsCountProps) => {
  const { t } = useTranslation('transactions');

  return (
    <div className="text-sm text-text-muted">
      <span>{t('transactionsCount')}: </span>
      <span className="font-semibold text-text">{totalItems}</span>
    </div>
  );
};
