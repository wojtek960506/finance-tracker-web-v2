import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import type {
  Transaction,
  TransactionDetails,
  TrashedTransaction,
  TrashedTransactionDetails,
} from '@transactions/api';
import { getTransactionNamedResourceLabel } from '@transactions/utils/get-transaction-named-resource-label';
import { getTransactionAmountPresentation } from '@transactions/utils/transaction-amount';
import { ButtonLink } from '@ui';

import { Detail } from './detail';

type TransactionWithReference = TransactionDetails | TrashedTransactionDetails;
type ReferenceDetail = {
  title: string;
  value: string;
  titleClassName?: string;
  valueClassName?: string;
};

const hasReference = (
  transaction: TransactionWithReference,
): transaction is TransactionWithReference & {
  reference: Transaction | TrashedTransaction;
} => Boolean(transaction.reference);

const formatExchangeRate = (exchangeRate: number, currencies: string) => {
  const [baseCurrency, quoteCurrency] = currencies.split('/');

  return `1 ${baseCurrency} = ${exchangeRate.toFixed(4)} ${quoteCurrency}`;
};

const getReferenceDetails = (
  transaction: TransactionWithReference,
  t: (key: string) => string,
  tNamedResources: (key: string) => string,
  language: string,
): ReferenceDetail[] => {
  if (!hasReference(transaction)) return [];

  const { reference } = transaction;
  const details: ReferenceDetail[] = [];

  if (
    transaction.amount !== reference.amount ||
    transaction.currency !== reference.currency ||
    transaction.transactionType !== reference.transactionType
  ) {
    const amountPresentation = getTransactionAmountPresentation(reference);
    details.push({
      title: t('amount'),
      value: amountPresentation.formattedAmount,
      titleClassName: amountPresentation.labelClassName,
      valueClassName: amountPresentation.valueClassName,
    });
  }

  if (transaction.account.id !== reference.account.id) {
    details.push({
      title: t('account'),
      value: getTransactionNamedResourceLabel(reference.account, tNamedResources),
    });
  }

  if (transaction.paymentMethod.id !== reference.paymentMethod.id) {
    details.push({
      title: t('paymentMethod'),
      value: getTransactionNamedResourceLabel(reference.paymentMethod, tNamedResources),
    });
  }

  if (transaction.category.id !== reference.category.id) {
    details.push({
      title: t('category'),
      value: getTransactionNamedResourceLabel(reference.category, tNamedResources),
    });
  }

  if (transaction.date !== reference.date) {
    details.push({
      title: t('date'),
      value: new Date(reference.date).toLocaleDateString(language),
    });
  }

  return details;
};

export const AdditionalDetails = ({
  transaction,
  referencePathPrefix = '/transactions',
}: {
  transaction: TransactionWithReference;
  referencePathPrefix?: string;
}) => {
  const { t } = useTranslation('transactions');
  const { t: tNamedResources } = useTranslation('namedResources');
  const { language } = useLanguage();
  const { refId, currencies, exchangeRate } = transaction;
  const hasExchangeRate = Boolean(currencies && exchangeRate);
  const referenceDetails = getReferenceDetails(transaction, t, tNamedResources, language);
  const hasReferenceSummary = referenceDetails.length > 0;
  const hasReferenceLink = Boolean(refId);

  if (!hasExchangeRate && !hasReferenceSummary && !hasReferenceLink) return null;

  return (
    <>
      <div className="border-t-[1px] border-text-muted" />
      {hasExchangeRate && currencies && exchangeRate && (
        <Detail title={t('exchangeRate')}>
          {formatExchangeRate(exchangeRate, currencies)}
        </Detail>
      )}

      {hasReferenceSummary ? (
        <div className="rounded-2xl border border-fg/10 bg-card-bg/80 p-3 sm:p-4">
          <div className="flex flex-col gap-2">
            <span className="text-left text-sm font-semibold text-text-muted">
              {t('referencedTransaction')}
            </span>
            {referenceDetails.map(
              ({ title, value, titleClassName, valueClassName }, index) => (
                <Detail
                  key={`${title}-${index}`}
                  title={title}
                  titleClassName={titleClassName}
                  valueClassName={valueClassName}
                >
                  {value}
                </Detail>
              ),
            )}
          </div>
        </div>
      ) : null}

      {hasReferenceLink ? (
        <ButtonLink
          to={`${referencePathPrefix}/${refId}`}
          className="justify-self-center w-full"
        >
          {t('goToReferencedTransaction')}
        </ButtonLink>
      ) : null}
    </>
  );
};
