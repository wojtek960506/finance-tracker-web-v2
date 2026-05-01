import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { getTransaction } from '@transactions/api';
import { getTransactionKind } from '@transactions/consts';
import { Card, LoadingState } from '@ui';

import { UpdateExchangeTransactionView } from './update-exchange-transaction-view';
import { UpdateStandardTransactionView } from './update-standard-transaction-view';
import { UpdateTransferTransactionView } from './update-transfer-transaction-view';

export const UpdateTransaction = () => {
  const { t } = useTranslation('transactions');
  const { transactionId } = useParams<{ transactionId: string }>();

  const {
    data: transaction,
    isLoading: isTransactionLoading,
    error: transactionError,
  } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: async () => await getTransaction(transactionId!),
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
  });

  if (isTransactionLoading || isTransactionRefLoading) {
    return (
      <div className="m-auto flex max-w-100 flex-col gap-2 sm:gap-3">
        <Card className="gap-4 rounded-3xl border-fg/20 bg-modal-bg/95 p-6 sm:p-8">
          <LoadingState
            title={t('loadingTransactionForm')}
            description={t('loadingTransactionFormDescription')}
            className="py-4"
          />
        </Card>
      </div>
    );
  }
  if (transactionError) return <p>{transactionError.message}</p>;
  if (transactionRefError) return <p>{transactionRefError.message}</p>;
  if (!transaction) return <p>No transaction</p>;

  if (transactionKind === 'standard') {
    return <UpdateStandardTransactionView transaction={transaction} />;
  }

  if (!transactionRef) return <p>No transaction</p>;

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
