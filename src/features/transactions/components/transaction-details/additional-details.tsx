import { useTranslation } from 'react-i18next';

import type { Transaction } from '@transactions/api';
import { EXCHANGE_CATEGORY, TRANSFER_CATEGORY } from '@transactions/consts';
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

  if (![TRANSFER_CATEGORY, EXCHANGE_CATEGORY].includes(transaction.category.name))
    return null;

  const { refId, currencies, exchangeRate } = transaction;

  return (
    <>
      <div className="border-t-[1px] border-text-muted" />
      {currencies && exchangeRate && (
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
