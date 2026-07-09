import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';

import { getTransaction } from '@transactions/api';
import { TransactionFallbackState } from '@transactions/components/shared';
import { getTransactionKind } from '@transactions/consts';
import {
  getTransactionsReturnTo,
  isNotFoundTransactionQueryError,
} from '@transactions/utils';
import { LoadingCard } from '@ui';

import { UpdateExchangeTransactionView } from './update-exchange-transaction-view';
import { UpdateStandardTransactionView } from './update-standard-transaction-view';
import { UpdateTransferTransactionView } from './update-transfer-transaction-view';

export const UpdateTransaction = () => {
  const { t } = useTranslation('transactions');
  const location = useLocation();
  const { transactionId } = useParams<{ transactionId: string }>();
  const returnTo = getTransactionsReturnTo(location.state);

  const {
    data: transaction,
    isLoading: isTransactionLoading,
    error: transactionError,
  } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: async () => await getTransaction(transactionId!),
    retry: false,
  });

  const transactionKind = transaction ? getTransactionKind(transaction) : undefined;
  const shouldLoadReference =
    Boolean(transaction?.refId) && transactionKind !== 'standard';

  const {
    data: transactionRef,
    isLoading: isTransactionRefLoading,
    error: transactionRefError,
  } = useQuery({
    queryKey: ['transaction', transaction?.refId],
    queryFn: async () => await getTransaction(transaction!.refId!),
    enabled: shouldLoadReference,
    retry: false,
  });

  if (isTransactionLoading || isTransactionRefLoading) {
    return (
      <LoadingCard
        title={t('loadingTransactionForm')}
        description={t('loadingTransactionFormDescription')}
        widthClassName="max-w-100"
      />
    );
  }

  const transactionNotFoundState = (
    <TransactionFallbackState
      title={t('transactionNotFoundTitle')}
      description={t('transactionNotFoundDescription')}
      actionLabel={t('backToTransactions')}
      to={returnTo}
    />
  );

  const transactionErrorState = transactionError ? (
    <TransactionFallbackState
      title={t('transactionLoadFailedTitle')}
      description={transactionError.message}
      actionLabel={t('backToTransactions')}
      to={returnTo}
    />
  ) : null;

  const transactionReferenceErrorState = transactionRefError ? (
    <TransactionFallbackState
      title={t('transactionLoadFailedTitle')}
      description={transactionRefError.message}
      actionLabel={t('backToTransactions')}
      to={returnTo}
    />
  ) : null;

  if (transactionError && isNotFoundTransactionQueryError(transactionError)) {
    return transactionNotFoundState;
  }
  if (transactionError) return transactionErrorState;
  if (transactionRefError && isNotFoundTransactionQueryError(transactionRefError)) {
    return transactionNotFoundState;
  }
  if (transactionRefError) return transactionReferenceErrorState;
  if (!transaction) return transactionNotFoundState;

  if (transactionKind === 'standard') {
    return <UpdateStandardTransactionView transaction={transaction} />;
  }

  if (!transactionRef) return transactionNotFoundState;

  if (transactionKind === 'transfer') {
    return (
      <UpdateTransferTransactionView
        transaction={transaction}
        transactionRef={transactionRef}
      />
    );
  }

  return (
    <UpdateExchangeTransactionView
      transaction={transaction}
      transactionRef={transactionRef}
    />
  );
};
