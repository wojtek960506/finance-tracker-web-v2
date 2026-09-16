import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import { getTransactionsReturnTo } from '@transactions/utils';

import { bulkTransactionFormSchema } from '../schemas';
import type { BulkTransactionFormValues } from '../types';
import {
  getDefaultBulkTransactionRowValues,
  getMeaningfulBulkTransactionRows,
} from '../utils';

import { useBulkDiscardModal } from './use-bulk-discard-modal';
import { useBulkRowActions } from './use-bulk-row-actions';
import { useBulkRowFocus } from './use-bulk-row-focus';
import { useBulkSubmit } from './use-bulk-submit';

export const useCreateBulkTransaction = () => {
  const location = useLocation();
  const returnTo = getTransactionsReturnTo(location.state);
  const [createInstrumentRowIndex, setCreateInstrumentRowIndex] = useState<number | null>(
    null,
  );

  const form = useForm<BulkTransactionFormValues>({
    resolver: zodResolver(bulkTransactionFormSchema),
    defaultValues: {
      rows: [getDefaultBulkTransactionRowValues()],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'rows',
  });

  const rows = useWatch({
    control: form.control,
    name: 'rows',
  });

  const meaningfulRows = getMeaningfulBulkTransactionRows(rows ?? []);
  const { registerKindSelectTrigger, setPendingKindFocusRowIndex } = useBulkRowFocus(
    fields.length,
  );

  const { appendRow, duplicateLastRow, setRowKind, deleteRow } = useBulkRowActions({
    form,
    fields,
    append,
    remove,
    replace,
    setPendingKindFocusRowIndex,
  });

  const {
    isDiscardModalOpen,
    setIsDiscardModalOpen,
    cancelButtonRef,
    handleCancel,
    handleConfirmDiscard,
  } = useBulkDiscardModal({
    meaningfulRowsCount: meaningfulRows.length,
    returnTo,
  });

  const { isPending, onSubmit } = useBulkSubmit({
    form,
    returnTo,
  });

  const handleCreateInstrumentSuccess = (instrumentId: string) => {
    if (createInstrumentRowIndex !== null) {
      form.setValue(
        `rows.${createInstrumentRowIndex}.investmentValues.instrumentId`,
        instrumentId,
        { shouldDirty: true, shouldValidate: true },
      );
    }
  };

  return {
    form,
    fields,
    rows,
    meaningfulRows,
    isPending,
    isDiscardModalOpen,
    setIsDiscardModalOpen,
    cancelButtonRef,
    createInstrumentRowIndex,
    setCreateInstrumentRowIndex,
    registerKindSelectTrigger,
    appendRow,
    duplicateLastRow,
    setRowKind,
    deleteRow,
    onSubmit,
    handleCancel,
    handleConfirmDiscard,
    handleCreateInstrumentSuccess,
  };
};
