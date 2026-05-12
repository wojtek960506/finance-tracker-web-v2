import { useTranslation } from 'react-i18next';

import { Button } from '@shared/ui';
import { FORM_BUTTON_CLASS_NAME } from '@transactions/components/transaction-forms';

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
    <div className="flex flex-col gap-1 sm:gap-2 border-t border-fg/10 pt-3 sm:pt-4">
      <Button
        type="button"
        variant="primary"
        className={FORM_BUTTON_CLASS_NAME}
        onClick={onApply}
      >
        {t('applyFilters')}
      </Button>
      <Button
        type="button"
        variant="secondary"
        className={FORM_BUTTON_CLASS_NAME}
        onClick={onClear}
      >
        {t('clearFilters')}
      </Button>
    </div>
  );
};
