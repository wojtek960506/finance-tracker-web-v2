import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import type { TransactionInvestmentDetails } from '@transactions/api';

type InvestmentPreviewMetadataProps = {
  investment: TransactionInvestmentDetails;
};

export const InvestmentPreviewMetadata = ({
  investment,
}: InvestmentPreviewMetadataProps) => {
  const { t } = useTranslation('transactions');

  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
      <span
        className={clsx(
          'inline-flex items-center rounded-full border px-2 py-0.5',
          'text-xs font-semibold capitalize',
          investment.operationKind === 'buy' &&
            'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400',
          investment.operationKind === 'sell' &&
            'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400',
        )}
        data-testid="transaction-preview-operation-kind"
      >
        {t(`operationKind.${investment.operationKind}`)}
      </span>
      <span
        className="font-medium text-text-muted"
        data-testid="transaction-preview-instrument-name"
      >
        {investment.instrument.name}
      </span>
    </div>
  );
};
