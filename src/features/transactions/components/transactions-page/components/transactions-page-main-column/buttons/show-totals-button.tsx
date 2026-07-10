import clsx from 'clsx';
import { ChartColumnBig } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { FORM_BUTTON_SIZE_CLASS } from '@shared/consts';
import { Button } from '@shared/ui';
import { useTransactionsPageContext } from '@transactions/components/transactions-page/context';

export const ShowTotalsButton = () => {
  const { t } = useTranslation('transactions');
  const { isTotalsOpen, totalsButtonRef, handleToggleTotals } =
    useTransactionsPageContext();

  return (
    <Button
      ref={totalsButtonRef}
      type="button"
      variant={isTotalsOpen ? 'secondary' : 'outline'}
      className={clsx(FORM_BUTTON_SIZE_CLASS, 'gap-2')}
      aria-label={isTotalsOpen ? t('hideTotals') : t('showTotals')}
      aria-expanded={isTotalsOpen}
      aria-controls="transactions-totals-panel"
      onClick={handleToggleTotals}
    >
      <ChartColumnBig className="size-4 sm:size-5" aria-hidden="true" />
      <span aria-hidden="true" className="hidden sm:inline">
        {t('totals')}
      </span>
    </Button>
  );
};
