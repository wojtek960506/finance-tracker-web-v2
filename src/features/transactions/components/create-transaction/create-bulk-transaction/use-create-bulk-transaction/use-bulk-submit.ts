import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';
import { createBulkTransactions } from '@transactions/api';
import { shouldWarnAboutHiddenTransactions } from '@transactions/utils';

import type { BulkTransactionFormValues } from '../types';
import { getMeaningfulBulkTransactionRows, toBulkTransactionDto } from '../utils';

type UseBulkSubmitProps = {
  form: UseFormReturn<BulkTransactionFormValues>;
  returnTo: string;
};

export const useBulkSubmit = ({ form, returnTo }: UseBulkSubmitProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);
  const { t } = useTranslation('transactions');
  const [isPending, setIsPending] = useState(false);

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

  return {
    isPending,
    onSubmit,
  };
};
