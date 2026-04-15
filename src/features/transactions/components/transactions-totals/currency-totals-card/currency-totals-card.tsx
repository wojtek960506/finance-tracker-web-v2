import clsx from "clsx";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import type { TransactionTotalsByCurrency } from "@transactions/api";

import { Card } from "@/shared/ui";

type TotalsMetricKey =
  | 'totalItems'
  | 'totalAmount'
  | 'averageAmount'
  | 'maxAmount'
  | 'minAmount';

const totalsMetricKeys: TotalsMetricKey[] = [
  'totalItems',
  'totalAmount',
  'averageAmount',
  'maxAmount',
  'minAmount',
];

const formatDecimal = (value: number, language: string) =>
  new Intl.NumberFormat(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatCurrencyAmount = (value: number, currency: string, language: string) =>
  `${formatDecimal(value, language)} ${currency}`;

export const CurrencyTotalsCard = ({
  currency,
  totals,
  language,
  t,
}: {
  currency: string;
  totals: TransactionTotalsByCurrency;
  language: string;
  t: (key: string) => string;
}) => {
  return (
    <Card className="gap-3 rounded-2xl border-fg/15 bg-bg/55 shadow-none">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <h3 className="text-lg font-semibold sm:text-xl">{currency}</h3>
          <span className="text-sm text-text-muted">{t('currency')}</span>
        </div>
        <div className="rounded-full bg-bg px-3 py-1 text-sm font-semibold text-text">
          {t('totalItems')}: {totals.totalItems}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-2xl border border-fg/10 bg-bg/65 p-3 text-sm">
        <span className="text-text-muted" />
        <span className="flex items-center justify-center gap-1 font-semibold text-destructive">
          <ArrowDownLeft className="size-4" aria-hidden="true" />
          {t('expense')}
        </span>
        <span className="flex items-center justify-center gap-1 font-semibold text-bt-primary">
          <ArrowUpRight className="size-4" aria-hidden="true" />
          {t('income')}
        </span>

        {totalsMetricKeys.map((metricKey) => {
          const expenseValue =
            metricKey === 'totalItems'
              ? totals.expense.totalItems
              : formatCurrencyAmount(totals.expense[metricKey], currency, language);
          const incomeValue =
            metricKey === 'totalItems'
              ? totals.income.totalItems
              : formatCurrencyAmount(totals.income[metricKey], currency, language);

          return (
            <div className="contents" key={metricKey}>
              <span className="font-medium text-text">{t(metricKey)}</span>
              <span
                className={clsx(
                  'text-center font-semibold',
                  metricKey === 'totalItems' ? 'text-text' : 'text-destructive',
                )}
              >
                {expenseValue}
              </span>
              <span
                className={clsx(
                  'text-center font-semibold',
                  metricKey === 'totalItems' ? 'text-text' : 'text-bt-primary',
                )}
              >
                {incomeValue}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};