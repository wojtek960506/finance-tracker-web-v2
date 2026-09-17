import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import type { TransactionDetails, TrashedTransactionDetails } from '@transactions/api';
import { getTransactionNamedResourceLabel } from '@transactions/utils';
import { getTransactionAmountPresentation } from '@transactions/utils/transaction-amount';
import { Card, HoverLink } from '@ui';

import { AdditionalDetails } from '../additional-details';
import { Detail } from '../detail';

import { InvestmentDetails, TrashBadge, TrashDetails } from './components';

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
  const amountPresentation = getTransactionAmountPresentation({
    ...transaction,
    language,
  });
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

  const isInvestment =
    transaction.kind === 'investment' &&
    'investment' in transaction &&
    Boolean(transaction.investment);

  return (
    <Card className="relative gap-3 p-4 sm:gap-4 sm:p-5">
      {isTrashMode && <TrashBadge label={t('trashedTransaction')} />}

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

        {isInvestment && transaction.investment && (
          <InvestmentDetails investment={transaction.investment} />
        )}

        <Detail title={t('category')}>
          <HoverLink to="/transactions/categories">{categoryLabel}</HoverLink>
        </Detail>

        <Detail title={t('paymentMethod')}>
          <HoverLink to="/transactions/payment-methods">{paymentMethodLabel}</HoverLink>
        </Detail>

        <Detail title={t('account')}>
          <HoverLink to="/transactions/accounts">{accountLabel}</HoverLink>
        </Detail>

        {isTrashedTransaction(transaction) && (
          <TrashDetails deletion={transaction.deletion} />
        )}

        <AdditionalDetails
          transaction={transaction}
          referencePathPrefix={isTrashMode ? '/transactions/trash' : '/transactions'}
        />
      </div>
    </Card>
  );
};
