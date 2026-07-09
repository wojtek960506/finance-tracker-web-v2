import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import { CurrencySelectField } from '@transactions/components/shared';
import { formatCurrencyAmount } from '@transactions/utils';
import { Card } from '@ui';

const BALANCE_POSITIVE_CLASS = 'text-bt-primary';
const BALANCE_NEGATIVE_CLASS = 'text-destructive';

type TransactionAccountStatisticsHeaderProps = {
  baseCurrency: string;
  normalizedTotalAmount?: number;
  onBaseCurrencyChange: (baseCurrency: string) => void;
};

export const TransactionAccountStatisticsHeader = ({
  baseCurrency,
  normalizedTotalAmount,
  onBaseCurrencyChange,
}: TransactionAccountStatisticsHeaderProps) => {
  const { t } = useTranslation('transactions');
  const { language } = useLanguage();
  const normalizedAmountClassName =
    normalizedTotalAmount !== undefined && normalizedTotalAmount < 0
      ? BALANCE_NEGATIVE_CLASS
      : BALANCE_POSITIVE_CLASS;

  return (
    <Card className="gap-3 rounded-3xl border-fg/20 bg-modal-bg/95 p-4">
      <div className="flex flex-col gap-2 md:gap-3">
        <div className="flex w-full items-start justify-between gap-3">
          <h2 className="min-w-0 text-xl font-semibold sm:text-2xl">
            {t('accountStatistics')}
          </h2>

          {normalizedTotalAmount !== undefined ? (
            <div
              className={clsx(
                'shrink-0 text-xl font-semibold sm:text-2xl',
                normalizedAmountClassName,
              )}
            >
              {normalizedTotalAmount >= 0 && '+'}
              {formatCurrencyAmount(normalizedTotalAmount, baseCurrency, language)}
            </div>
          ) : null}
        </div>

        <p className="text-sm text-text-muted sm:text-base">
          {t('accountStatisticsDescription')}
        </p>

        <div className="w-full max-w-[18rem]">
          <CurrencySelectField
            value={baseCurrency}
            onChange={onBaseCurrencyChange}
            placeholder={t('baseCurrency')}
            searchPlaceholder={t('searchCurrencyPlaceholder')}
            emptyMessage={t('noCurrenciesFound')}
            showClear={false}
          />
        </div>
      </div>
    </Card>
  );
};
