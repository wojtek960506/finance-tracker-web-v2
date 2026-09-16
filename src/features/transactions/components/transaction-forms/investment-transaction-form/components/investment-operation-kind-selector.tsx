import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { Button, Label } from '@shared/ui';
import {
  FORM_BUTTON_CLASS_NAME,
  REQUIRED_LABEL_CLASS_NAME,
} from '@transactions/components/transaction-forms';

import { INVESTMENT_OPERATION_KINDS, type InvestmentOperationKind } from '../utils';

type InvestmentOperationKindSelectorProps = {
  selectedKind: InvestmentOperationKind;
  onSelectKind: (kind: InvestmentOperationKind) => void;
  disabled?: boolean;
};

const getOperationButtonStyles = (kind: InvestmentOperationKind, isSelected: boolean) => {
  if (!isSelected) {
    return clsx(
      'border-border bg-card-bg text-text-muted',
      'hover:text-fg hover:border-fg/40',
    );
  }

  switch (kind) {
    case 'buy':
      return clsx(
        'border-blue-500 bg-blue-500/10 font-semibold shadow-sm',
        'text-blue-600 dark:text-blue-400',
      );
    case 'sell':
      return clsx(
        'border-emerald-500 bg-emerald-500/10 font-semibold shadow-sm',
        'text-emerald-600 dark:text-emerald-400',
      );
    case 'interest':
      return clsx(
        'border-purple-500 bg-purple-500/10 font-semibold shadow-sm',
        'text-purple-600 dark:text-purple-400',
      );
    case 'fee':
      return clsx(
        'border-amber-500 bg-amber-500/10 font-semibold shadow-sm',
        'text-amber-600 dark:text-amber-400',
      );
  }
};

export const InvestmentOperationKindSelector = ({
  selectedKind,
  onSelectKind,
  disabled,
}: InvestmentOperationKindSelectorProps) => {
  const { t } = useTranslation('transactions');

  return (
    <div className="sm:col-span-2 flex flex-col gap-1.5">
      <Label>
        <span className={REQUIRED_LABEL_CLASS_NAME}>{t('investmentOperationKind')}</span>
      </Label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {INVESTMENT_OPERATION_KINDS.map((kind) => {
          const isSelected = selectedKind === kind;
          return (
            <Button
              key={kind}
              type="button"
              variant="outline"
              className={clsx(
                FORM_BUTTON_CLASS_NAME,
                'capitalize transition-all border',
                getOperationButtonStyles(kind, isSelected),
              )}
              onClick={() => onSelectKind(kind)}
              disabled={disabled}
              data-testid={`operation-kind-${kind}`}
            >
              {t(`operationKind.${kind}`)}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
