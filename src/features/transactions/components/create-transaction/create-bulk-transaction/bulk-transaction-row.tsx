import { Trash2 } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '@shared/ui';
import { FieldError } from '@transactions/components/transaction-forms';

import { BulkTransactionKindField } from './bulk-transaction-kind-field';
import { ExchangeRowFields } from './exchange-row-fields';
import { InvestmentRowFields } from './investment-row-fields';
import { StandardRowFields } from './standard-row-fields';
import { TransferRowFields } from './transfer-row-fields';
import type {
  BulkTransactionFormValues,
  BulkTransactionKind,
  BulkTransactionRowValues,
} from './types';
import { getDeleteActionLabel } from './utils';

type BulkTransactionRowProps = {
  form: UseFormReturn<BulkTransactionFormValues>;
  index: number;
  row: BulkTransactionRowValues;
  isDeleteDisabled: boolean;
  showLabels: boolean;
  registerKindSelectTrigger: (node: HTMLButtonElement | null) => void;
  onSetRowKind: (kind: BulkTransactionKind) => void;
  onDeleteRow: () => void;
  onAddNewInstrument: () => void;
};

export const BulkTransactionRow = ({
  form,
  index,
  row,
  isDeleteDisabled,
  showLabels,
  registerKindSelectTrigger,
  onSetRowKind,
  onDeleteRow,
  onAddNewInstrument,
}: BulkTransactionRowProps) => {
  const { t } = useTranslation('transactions');
  const kindError = form.formState.errors.rows?.[index]?.kind?.message;

  const renderRowFields = () => {
    switch (row.kind) {
      case 'standard':
        return <StandardRowFields form={form} index={index} showLabels={showLabels} />;
      case 'transfer':
        return <TransferRowFields form={form} index={index} showLabels={showLabels} />;
      case 'exchange':
        return <ExchangeRowFields form={form} index={index} showLabels={showLabels} />;
      case 'investment':
        return (
          <InvestmentRowFields
            form={form}
            index={index}
            showLabels={showLabels}
            onAddNewInstrument={onAddNewInstrument}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-fg/10 bg-bg/30 p-2">
      <div className="flex min-w-max items-stretch gap-2">
        <div className="flex self-stretch flex-col">
          <Button
            type="button"
            variant="ghost"
            className="my-auto rounded-lg px-2 text-text-muted"
            onClick={onDeleteRow}
            aria-label={getDeleteActionLabel(index)}
            disabled={isDeleteDisabled}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
        <div className="space-y-1">
          <BulkTransactionKindField
            index={index}
            kind={row.kind}
            showLabel={showLabels && !(row.kind === '' && index > 0)}
            triggerRef={registerKindSelectTrigger}
            setKind={onSetRowKind}
          />
          {kindError && <FieldError message={t(kindError)} />}
        </div>
        {renderRowFields()}
      </div>
    </div>
  );
};
