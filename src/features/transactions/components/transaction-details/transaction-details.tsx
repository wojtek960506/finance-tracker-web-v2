import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { MAIN_BUTTON_TEXT } from '@shared/consts';
import { useLanguage } from '@shared/hooks';
import { getTransaction } from '@transactions/api';
import { Button, Card, HoverLink } from '@ui';

import { AdditionalDetails } from './additional-details';
import { Detail } from './detail';

export const TransactionDetails = () => {
  const { t } = useTranslation('transactions');
  const { language } = useLanguage();

  const { transactionId } = useParams<{ transactionId: string }>();

  const {
    data: transaction,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: async () => await getTransaction(transactionId!),
  });

  if (isLoading) return <p>Loading</p>;
  if (error) return <p>{error.message}</p>;
  if (!transaction) return <p>No transaction</p>;

  return (
    <div className="flex flex-col max-w-100 m-auto gap-2 sm:gap-3">
      <Button variant="secondary" className={MAIN_BUTTON_TEXT}>
        {t('updateTransaction')}
      </Button>
      <Card className="gap-3 sm:gap-4 p-4 sm:p-5">
        <h1 className="text-lg sm:text-xl font-semibold text-left">
          {transaction.description}
        </h1>
        <div className="flex flex-col gap-2">
          <Detail title={t('date')}>
            <time>{new Date(transaction.date).toLocaleDateString(language)}</time>
          </Detail>
          <Detail title={t('amount')}>
            {transaction.amount.toFixed(2)} {transaction.currency}
          </Detail>
          <Detail title={t('transactionType')}>{transaction.transactionType}</Detail>
          <Detail title={t('category')}>
            <HoverLink to="/categories">{transaction.category.name}</HoverLink>
          </Detail>
          <Detail title={t('paymentMethod')}>
            <HoverLink to="/paymentMethods">{transaction.paymentMethod.name}</HoverLink>
          </Detail>
          <Detail title={t('account')}>
            <HoverLink to="/accounts">{transaction.account.name}</HoverLink>
          </Detail>
          <AdditionalDetails transaction={transaction} />
        </div>
      </Card>
      <Button variant="destructive" className={MAIN_BUTTON_TEXT}>
        {t('deleteTransaction')}
      </Button>
    </div>
  );
};
