import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom"

import { getTransaction } from "@transactions/api";

import { useAuthToken } from "@/shared/hooks";
import { Button, Card } from "@/shared/ui";

export const TransactionDetails = () => {
  const { t } = useTranslation("transactions");

  const { transactionId } = useParams<{ transactionId: string }>();

  console.log('transactionId', transactionId);

  const { authToken } = useAuthToken();
  const { data: transaction, isLoading, error } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: async () => await getTransaction(authToken, transactionId!),
  });

  if (isLoading) return <p>Loading</p>;
  if (error) return <p>{error.message}</p>;
  if (!transaction) return <p>No transaction</p>;

  console.log('transaction', transaction);

  return ( 
    <>
      
      <Card className="max-w-150 m-auto">
        <Button variant='primary'>{t('update')}</Button>
        <div className="grid grid-cols-[auto_auto] gap-2">
          <span>{t('description')}</span>
          <span>{transaction.description}</span>

          <span>{t('date')}</span>
          <time>{transaction.date}</time>

          <span>{t('amount')}</span>
          <span>{transaction.amount}</span>

          <span>{t('currency')}</span>
          <span>{transaction.currency}</span>

          <span>{t('transactionType')}</span>
          <span>{transaction.transactionType}</span>

          <span>{t('category')}</span>
          <span>{transaction.category.name}</span>
          
          <span>{t('paymentMethod')}</span>
          <span>{transaction.paymentMethod.name}</span>

          <span>{t('account')}</span>
          <span>{transaction.account.name}</span>

        </div>
        <Button variant='destructive'>{t('delete')}</Button>
      </Card>
    </>
  )
}