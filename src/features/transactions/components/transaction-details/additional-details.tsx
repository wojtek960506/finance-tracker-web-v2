import { useTranslation } from 'react-i18next';

import type { Transaction } from '@transactions/api';
import { getTransactionKind } from '@transactions/consts';
import { ButtonLink } from '@ui';

import { Detail } from './detail';

const formatExchangeRate = (exchangeRate: number, currencies: string) => {
  const [baseCurrency, quoteCurrency] = currencies.split('/');

  return `1 ${baseCurrency} = ${exchangeRate.toFixed(4)} ${quoteCurrency}`;
};

export const AdditionalDetails = ({
  transaction,
  referencePathPrefix = '/transactions',
}: {
  transaction: Transaction;
  referencePathPrefix?: string;
}) => {
  const { t } = useTranslation('transactions');
  const transactionKind = getTransactionKind(transaction);

  if (transactionKind === 'standard') return null;

  const { refId, currencies, exchangeRate } = transaction;

  return (
    <>
      <div className="border-t-[1px] border-text-muted" />
      {transactionKind === 'exchange' && currencies && exchangeRate && (
        <Detail title={t('exchangeRate')}>
          {formatExchangeRate(exchangeRate, currencies)}
        </Detail>
      )}

      {refId && (
        <ButtonLink
          to={`${referencePathPrefix}/${refId}`}
          className="justify-self-center w-full"
        >
          {t('goToReferencedTransaction')}
        </ButtonLink>
      )}
    </>
  );
};
