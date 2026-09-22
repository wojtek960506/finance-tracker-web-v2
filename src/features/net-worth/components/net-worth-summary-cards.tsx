import clsx from 'clsx';
import { Landmark, TrendingUp, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import { Card } from '@shared/ui';

import type { NetWorthTotalsDTO } from '../api';
import { formatCurrencyAmount, formatPercentage } from '../utils';

type NetWorthSummaryCardsProps = {
  totals: NetWorthTotalsDTO;
  baseCurrency: string;
};

export const NetWorthSummaryCards = ({
  totals,
  baseCurrency,
}: NetWorthSummaryCardsProps) => {
  const { t } = useTranslation('net-worth');
  const { language } = useLanguage();

  const liquidPercentage =
    totals.total > 0 ? (totals.liquidCash / totals.total) * 100 : 0;
  const investmentPercentage =
    totals.total > 0 ? (totals.investments / totals.total) * 100 : 0;

  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      data-testid="net-worth-summary-cards"
    >
      {/* 1. Total Net Worth */}
      <Card
        className={clsx(
          'flex flex-col justify-between gap-3 p-4',
          'border-primary/30 bg-primary/[0.04]',
          'dark:border-primary/40 dark:bg-primary/10',
        )}
      >
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {t('totalNetWorth')}
          </span>
          <Wallet className="size-5 text-primary" />
        </div>

        <div>
          <div className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            {formatCurrencyAmount(totals.total, baseCurrency, language)}
          </div>
          <p className="mt-1 text-xs text-text-muted">{baseCurrency}</p>
        </div>
      </Card>

      {/* 2. Liquid Bank Cash */}
      <Card className="flex flex-col justify-between gap-3 p-4">
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-xs font-semibold uppercase tracking-wider">
            {t('liquidCash')}
          </span>
          <Landmark className="size-5 text-emerald-500" />
        </div>

        <div>
          <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {formatCurrencyAmount(totals.liquidCash, baseCurrency, language)}
          </div>
          <p className="mt-1 text-xs text-text-muted">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {formatPercentage(liquidPercentage, language)}%
            </span>{' '}
            • {t('liquidCashDescription')}
          </p>
        </div>
      </Card>

      {/* 3. Investments */}
      <Card className="flex flex-col justify-between gap-3 p-4">
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-xs font-semibold uppercase tracking-wider">
            {t('investments')}
          </span>
          <TrendingUp className="size-5 text-sky-500" />
        </div>

        <div>
          <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {formatCurrencyAmount(totals.investments, baseCurrency, language)}
          </div>
          <p className="mt-1 text-xs text-text-muted">
            <span className="font-semibold text-sky-600 dark:text-sky-400">
              {formatPercentage(investmentPercentage, language)}%
            </span>{' '}
            • {t('investmentsDescription')}
          </p>
        </div>
      </Card>
    </div>
  );
};
