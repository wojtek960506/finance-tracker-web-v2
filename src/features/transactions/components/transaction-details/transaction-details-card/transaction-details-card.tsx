import clsx from 'clsx';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import type { TransactionDetails, TrashedTransactionDetails } from '@transactions/api';
import { getTransactionNamedResourceLabel } from '@transactions/utils/get-transaction-named-resource-label';
import { getTransactionAmountPresentation } from '@transactions/utils/transaction-amount';
import { Card, HoverLink } from '@ui';

import { AdditionalDetails } from '../additional-details';
import { Detail } from '../detail';

type TransactionDetailsCardProps = {
  transaction: TransactionDetails | TrashedTransactionDetails;
  mode?: 'active' | 'trash';
};

const isTrashedTransaction = (
  transaction: TransactionDetails | TrashedTransactionDetails,
): transaction is TrashedTransactionDetails => 'deletion' in transaction;

export const TransactionDetailsCard = ({
  transaction,
  mode = 'active',
}: TransactionDetailsCardProps) => {
  const { t } = useTranslation('transactions');
  const { t: tNamedResources } = useTranslation('namedResources');
  const { language } = useLanguage();
  const isTrashMode = mode === 'trash';
  const amountPresentation = getTransactionAmountPresentation(transaction);
  const categoryLabel = getTransactionNamedResourceLabel(
    transaction.category,
    tNamedResources,
  );
  const paymentMethodLabel = getTransactionNamedResourceLabel(
    transaction.paymentMethod,
    tNamedResources,
  );
  const accountLabel = getTransactionNamedResourceLabel(
    transaction.account,
    tNamedResources,
  );

  return (
    <Card className="relative gap-3 p-4 sm:gap-4 sm:p-5">
      {isTrashMode ? (
        <div className="absolute right-4 top-4 rounded-full border border-destructive-border bg-destructive/10 p-2 text-destructive">
          <Trash2 className="size-7 sm:size-8" aria-label={t('trashedTransaction')} />
        </div>
      ) : null}
      <h1
        className={clsx(
          isTrashMode && 'pr-16',
          'text-left text-lg font-semibold sm:text-xl',
        )}
      >
        {transaction.description}
      </h1>
      <div className="flex flex-col gap-2">
        <Detail title={t('date')}>
          <time>{new Date(transaction.date).toLocaleDateString(language)}</time>
        </Detail>
        <Detail
          title={t('amount')}
          titleClassName={amountPresentation.labelClassName}
          valueClassName={clsx('font-semibold', amountPresentation.valueClassName)}
        >
          {amountPresentation.formattedAmount}
        </Detail>
        <Detail title={t('category')}>
          <HoverLink to="/categories">{categoryLabel}</HoverLink>
        </Detail>
        <Detail title={t('paymentMethod')}>
          <HoverLink to="/paymentMethods">{paymentMethodLabel}</HoverLink>
        </Detail>
        <Detail title={t('account')}>
          <HoverLink to="/accounts">{accountLabel}</HoverLink>
        </Detail>
        {isTrashedTransaction(transaction) ? (
          <>
            <Detail
              title={t('deletedAt')}
              titleClassName="text-transaction-expense-label"
              valueClassName="text-destructive"
            >
              <time>
                {new Date(transaction.deletion.deletedAt).toLocaleString(language)}
              </time>
            </Detail>
            <Detail
              title={t('purgeAt')}
              titleClassName="text-transaction-expense-label"
              valueClassName="text-destructive"
            >
              <time>
                {new Date(transaction.deletion.purgeAt).toLocaleString(language)}
              </time>
            </Detail>
          </>
        ) : null}
        <AdditionalDetails
          transaction={transaction}
          referencePathPrefix={isTrashMode ? '/transactions/trash' : '/transactions'}
        />
      </div>
    </Card>
  );
};
