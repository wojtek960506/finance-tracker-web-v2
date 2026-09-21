import clsx from 'clsx';
import { Activity, Flame, ShieldCheck, Umbrella } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import { Card } from '@shared/ui';

import type {
  NetWorthIndependenceHorizonDTO,
  NetWorthIndependenceMonthlyAveragesDTO,
  NetWorthZeroIncomeBaselineDTO,
} from '../api';
import {
  formatCurrencyAmount,
  formatDecimal,
  formatHorizonYearsAndMonths,
} from '../utils';

type NetWorthIndependenceCardsProps = {
  independence: NetWorthIndependenceHorizonDTO;
  zeroIncomeBaseline: NetWorthZeroIncomeBaselineDTO;
  monthlyAverages: NetWorthIndependenceMonthlyAveragesDTO;
  baseCurrency?: string;
};

// TODO simplify this file as we have duplicated code
// basically colors are the only differences in styling
export const NetWorthIndependenceCards = ({
  independence,
  zeroIncomeBaseline,
  monthlyAverages,
  baseCurrency,
}: NetWorthIndependenceCardsProps) => {
  const { t } = useTranslation('net-worth');
  const { language } = useLanguage();

  const isPerpetual = independence.isPerpetual;
  const netWorthMonths = independence.netWorthMonths;
  const liquidCapitalMonths = independence.liquidCapitalMonths;
  const zeroIncomeMonths = zeroIncomeBaseline.netWorthMonths;

  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
      data-testid="net-worth-independence-cards"
    >
      {/* 1. Financial Independence Horizon */}
      <Card
        className={clsx(
          'flex flex-col justify-between gap-3 p-4',
          'border-emerald-500/30 bg-emerald-500/[0.04]',
          'dark:border-emerald-500/40 dark:bg-emerald-500/10',
        )}
      >
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {t('financialIndependence')}
          </span>
          <ShieldCheck className="size-5 text-emerald-500" />
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {isPerpetual
                ? '∞'
                : netWorthMonths !== null
                  ? `${formatDecimal(netWorthMonths, language)}`
                  : '—'}
            </span>
            {!isPerpetual && netWorthMonths !== null && (
              <span className="text-sm font-medium text-text-muted">
                {t('monthsUnitShort')}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-text-muted">
            {isPerpetual
              ? t('perpetualSubtitle')
              : netWorthMonths !== null
                ? formatHorizonYearsAndMonths(netWorthMonths, t)
                : t('financialIndependenceDescription')}
          </p>
        </div>
      </Card>

      {/* 2. Liquid Safety Buffer */}
      <Card className="flex flex-col justify-between gap-3 p-4">
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            {t('liquidSafetyBuffer')}
          </span>
          <Umbrella className="size-5 text-teal-500" />
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {isPerpetual
                ? '∞'
                : liquidCapitalMonths !== null
                  ? `${formatDecimal(liquidCapitalMonths, language)}`
                  : '—'}
            </span>
            {!isPerpetual && liquidCapitalMonths !== null && (
              <span className="text-sm font-medium text-text-muted">
                {t('monthsUnitShort')}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-text-muted">
            {isPerpetual
              ? t('perpetualSubtitle')
              : liquidCapitalMonths !== null
                ? formatHorizonYearsAndMonths(liquidCapitalMonths, t)
                : t('liquidSafetyBufferDescription')}
          </p>
        </div>
      </Card>

      {/* 3. Net Burn Rate */}
      <Card className="flex flex-col justify-between gap-3 p-4">
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            {t('netBurnRate')}
          </span>
          <Flame className="size-5 text-amber-500" />
        </div>

        <div>
          <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {formatCurrencyAmount(monthlyAverages.netBurnRate, baseCurrency, language)}
            <span className="text-xs font-normal text-text-muted">
              {' '}
              / {t('monthsUnitShort')}
            </span>
          </div>
          <p className="mt-1 text-xs text-text-muted">
            {t('grossExpenses')}:{' '}
            {formatCurrencyAmount(monthlyAverages.grossExpenses, baseCurrency, language)}
          </p>
        </div>
      </Card>

      {/* 4. Conservative 0-Income Baseline */}
      <Card className="flex flex-col justify-between gap-3 p-4">
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            {t('zeroIncomeBaseline')}
          </span>
          <Activity className="size-5 text-sky-500" />
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {zeroIncomeMonths !== null
                ? `${formatDecimal(zeroIncomeMonths, language)}`
                : '—'}
            </span>
            {zeroIncomeMonths !== null && (
              <span className="text-sm font-medium text-text-muted">
                {t('monthsUnitShort')}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-text-muted">
            {zeroIncomeMonths !== null
              ? formatHorizonYearsAndMonths(zeroIncomeMonths, t)
              : t('zeroIncomeBaselineDescription')}
          </p>
        </div>
      </Card>
    </div>
  );
};
