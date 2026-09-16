import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';
import { createBulkTransactions } from '@transactions/api';
import {
  getTransactionsReturnTo,
  getTransactionsRouteState,
  shouldWarnAboutHiddenTransactions,
} from '@transactions/utils';

import { bulkTransactionFormSchema } from './schemas';
import type { BulkTransactionFormValues, BulkTransactionKind } from './types';
import {
  cloneBulkTransactionRowValues,
  getBulkExchangeTransactionFormValues,
  getBulkInvestmentTransactionFormValues,
  getBulkStandardTransactionFormValues,
  getBulkTransactionRowDate,
  getBulkTransferTransactionFormValues,
  getDefaultBulkTransactionRowValues,
  getMeaningfulBulkTransactionRows,
  toBulkTransactionDto,
} from './utils';

export const useCreateBulkTransaction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);
  const { t } = useTranslation('transactions');
  const returnTo = getTransactionsReturnTo(location.state);
  const [isPending, setIsPending] = useState(false);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
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
  const kindSelectTriggerRefs = useRef(new Map<number, HTMLButtonElement>());
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);
  const [pendingKindFocusRowIndex, setPendingKindFocusRowIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (pendingKindFocusRowIndex === null) return;

    const trigger = kindSelectTriggerRefs.current.get(pendingKindFocusRowIndex);
    if (!trigger) return;

    trigger.focus();
    setPendingKindFocusRowIndex(null);
  }, [fields.length, pendingKindFocusRowIndex]);

  const registerKindSelectTrigger =
    (index: number) => (node: HTMLButtonElement | null) => {
      if (node) {
        kindSelectTriggerRefs.current.set(index, node);
        return;
      }

      kindSelectTriggerRefs.current.delete(index);
    };

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

  const onSubmit = form.handleSubmit(async (values) => {
    const transactionsToCreate = getMeaningfulBulkTransactionRows(values.rows);

    if (transactionsToCreate.length === 0) {
      return;
    }

    setIsPending(true);
    try {
      const createdTransactions = await createBulkTransactions({
        transactions: transactionsToCreate.map(toBulkTransactionDto),
      });

      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
      pushToast({
        variant: 'success',
        title: t('transactionsCreated'),
        message: shouldWarnAboutHiddenTransactions(createdTransactions, returnTo)
          ? t('transactionMayBeHiddenByCurrentFilters')
          : undefined,
      });
      queryClient.removeQueries({ queryKey: ['transactions'] });
      queryClient.removeQueries({ queryKey: ['transaction-totals'] });
      navigate(returnTo);
    } catch (error) {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('bulkTransactionCreateFailed'),
        message:
          apiError.message ||
          t('bulkTransactionCreatePartiallyFailedMessage', {
            count: values.rows.length,
          }),
      });
    } finally {
      setIsPending(false);
    }
  });

  const handleCancel = () => {
    if (meaningfulRows.length === 0) {
      navigate('/transactions/new', {
        state: getTransactionsRouteState(returnTo),
      });
      return;
    }

    setIsDiscardModalOpen(true);
  };

  const handleConfirmDiscard = () => {
    setIsDiscardModalOpen(false);
    navigate('/transactions/new', {
      state: getTransactionsRouteState(returnTo),
    });
  };

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
