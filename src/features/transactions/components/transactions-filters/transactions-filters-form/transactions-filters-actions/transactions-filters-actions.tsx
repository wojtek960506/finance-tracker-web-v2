import { useTranslation } from 'react-i18next';

import { Button } from '@shared/ui';

type TransactionsFiltersActionsProps = {
  onApply: () => void;
  onClear: () => void;
};

export const TransactionsFiltersActions = ({
  onApply,
  onClear,
}: TransactionsFiltersActionsProps) => {
  const { t } = useTranslation('transactions');

  return (
    <div className="flex flex-col gap-2 border-t border-fg/10 pt-4">
      <Button type="button" variant="primary" onClick={onApply}>
        {t('applyFilters')}
      </Button>
      <Button type="button" variant="secondary" onClick={onClear}>
        {t('clearFilters')}
      </Button>
    </div>
  );
};
