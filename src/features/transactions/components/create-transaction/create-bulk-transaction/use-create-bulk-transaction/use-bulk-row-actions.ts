import type { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';

import type { BulkTransactionFormValues, BulkTransactionKind } from '../types';
import {
  cloneBulkTransactionRowValues,
  getBulkExchangeTransactionFormValues,
  getBulkInvestmentTransactionFormValues,
  getBulkStandardTransactionFormValues,
  getBulkTransactionRowDate,
  getBulkTransferTransactionFormValues,
  getDefaultBulkTransactionRowValues,
} from '../utils';

type UseBulkRowActionsProps = {
  form: UseFormReturn<BulkTransactionFormValues>;
  fields: UseFieldArrayReturn<BulkTransactionFormValues, 'rows'>['fields'];
  append: UseFieldArrayReturn<BulkTransactionFormValues, 'rows'>['append'];
  remove: UseFieldArrayReturn<BulkTransactionFormValues, 'rows'>['remove'];
  replace: UseFieldArrayReturn<BulkTransactionFormValues, 'rows'>['replace'];
  setPendingKindFocusRowIndex: (index: number | null) => void;
};

export const useBulkRowActions = ({
  form,
  fields,
  append,
  remove,
  replace,
  setPendingKindFocusRowIndex,
}: UseBulkRowActionsProps) => {
  const appendRow = (rowValues = getDefaultBulkTransactionRowValues()) => {
    const nextRowIndex = fields.length;
    append(rowValues);
    setPendingKindFocusRowIndex(nextRowIndex);
  };

  const duplicateLastRow = () => {
    const currentRows = form.getValues('rows');
    const lastRow =
      currentRows[currentRows.length - 1] ?? getDefaultBulkTransactionRowValues();
    const nextRows = [...currentRows, cloneBulkTransactionRowValues(lastRow)];

    form.reset(
      { rows: nextRows },
      {
        keepDirty: true,
        keepErrors: true,
        keepTouched: true,
      },
    );
    setPendingKindFocusRowIndex(nextRows.length - 1);
  };

  const setRowKind = (index: number, kind: BulkTransactionKind) => {
    const currentRow = form.getValues(`rows.${index}`);
    const date = getBulkTransactionRowDate(currentRow);

    form.setValue(
      `rows.${index}`,
      {
        ...getDefaultBulkTransactionRowValues(),
        kind,
        standardValues: {
          ...getBulkStandardTransactionFormValues(),
          date,
        },
        transferValues: {
          ...getBulkTransferTransactionFormValues(),
          date,
        },
        exchangeValues: {
          ...getBulkExchangeTransactionFormValues(),
          date,
        },
        investmentValues: {
          ...getBulkInvestmentTransactionFormValues(),
          date,
        },
      },
      { shouldDirty: true, shouldValidate: form.formState.isSubmitted },
    );
  };

  const deleteRow = (index: number) => {
    if (fields.length === 1) {
      replace([getDefaultBulkTransactionRowValues()]);
      return;
    }

    remove(index);
  };

  return {
    appendRow,
    duplicateLastRow,
    setRowKind,
    deleteRow,
  };
};
