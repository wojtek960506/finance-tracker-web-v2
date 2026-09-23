import {
  ArrowDownRight,
  ArrowUpRight,
  Ban,
  Landmark,
  Layers,
  PiggyBank,
  Wallet,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import { Card } from '@shared/ui';

import type {
  ExcludedCategoryItemDTO,
  NetWorthIndependenceCapitalDTO,
  NetWorthIndependenceMonthlyAveragesDTO,
} from '../api';
import { formatCurrencyAmount } from '../utils';

type NetWorthIndependenceBreakdownProps = {
  monthlyAverages: NetWorthIndependenceMonthlyAveragesDTO;
  netWorth: NetWorthIndependenceCapitalDTO;
  excludedCategories: ExcludedCategoryItemDTO[];
  baseCurrency?: string;
};

// TODO simplify this file as we fro sure have duplicated code
export const NetWorthIndependenceBreakdown = ({
  monthlyAverages,
  netWorth,
  excludedCategories,
  baseCurrency,
}: NetWorthIndependenceBreakdownProps) => {
  const { t } = useTranslation('net-worth');
  const { language } = useLanguage();

  return (
    <div
      className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      data-testid="net-worth-independence-breakdown"
    >
      {/* 1. Monthly Cashflow Dynamics */}
      <Card className="flex flex-col gap-4 p-4 sm:p-5">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          {t('detailsTitle')}
        </h3>

        <div className="flex flex-col gap-3">
          {/* Gross Expenses */}
          <div className="flex items-center justify-between border-b border-border/40 pb-2 text-sm">
            <div className="flex items-center gap-2 text-rose-500">
              <ArrowDownRight className="size-4" />
              <span className="text-text-muted">{t('grossExpenses')}</span>
            </div>
            <span className="font-semibold text-foreground">
              {formatCurrencyAmount(
                monthlyAverages.grossExpenses,
                baseCurrency,
                language,
              )}
            </span>
          </div>

          {/* Non-Work Inflows */}
          <div className="flex items-center justify-between border-b border-border/40 pb-2 text-sm">
            <div className="flex items-center gap-2 text-emerald-500">
              <ArrowUpRight className="size-4" />
              <span className="text-text-muted">{t('nonWorkIncome')}</span>
            </div>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              +
              {formatCurrencyAmount(
                monthlyAverages.nonWorkIncome,
                baseCurrency,
                language,
              )}
            </span>
          </div>

          {/* Excluded Work Salary */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-text-muted">
              <Ban className="size-4" />
              <span>{t('workIncomeExcluded')}</span>
            </div>
            <span className="font-medium text-text-muted">
              {formatCurrencyAmount(monthlyAverages.workIncome, baseCurrency, language)}
            </span>
          </div>
        </div>

        {/* Excluded Categories Tag List */}
        {excludedCategories.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-xs text-text-muted">
              {t('excludedCategoriesLabel')}:
            </span>
            {excludedCategories.map((cat) => (
              <span
                key={cat.id}
                className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-text-muted"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}
      </Card>

      {/* 2. Capital Structure & Buffer Breakdown */}
      <Card className="flex flex-col gap-4 p-4 sm:p-5">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          {t('assetAllocation')}
        </h3>

        <div className="flex flex-col gap-3">
          {/* Bank Cash */}
          <div className="flex items-center justify-between border-b border-border/40 pb-2 text-sm">
            <div className="flex items-center gap-2 text-emerald-500">
              <Landmark className="size-4" />
              <span className="text-text-muted">{t('bankCashOnly')}</span>
            </div>
            <span className="font-semibold text-foreground">
              {formatCurrencyAmount(netWorth.liquidCash, baseCurrency, language)}
            </span>
          </div>

          {/* Savings */}
          <div className="flex items-center justify-between border-b border-border/40 pb-2 text-sm">
            <div className="flex items-center gap-2 text-pink-600">
              <PiggyBank className="size-4" />
              <span className="text-text-muted">{t('categories.savings')}</span>
            </div>
            <span className="font-semibold text-foreground">
              {formatCurrencyAmount(netWorth.savings, baseCurrency, language)}
            </span>
          </div>

          {/* Liquid Capital Total */}
          <div className="flex items-center justify-between border-b border-border/40 pb-2 text-sm">
            <div className="flex items-center gap-2 text-sky-500">
              <Wallet className="size-4" />
              <span className="text-text-muted">{t('liquidCapital')}</span>
            </div>
            <span className="font-bold text-sky-600 dark:text-sky-400">
              {formatCurrencyAmount(netWorth.liquidCapital, baseCurrency, language)}
            </span>
          </div>

          {/* Locked Investments */}
          <div className="flex items-center justify-between border-b border-border/40 pb-2 text-sm">
            <div className="flex items-center gap-2 text-indigo-500">
              <Layers className="size-4" />
              <span className="text-text-muted">{t('lockedInvestments')}</span>
            </div>
            <span className="font-semibold text-foreground">
              {formatCurrencyAmount(netWorth.lockedInvestments, baseCurrency, language)}
            </span>
          </div>

          {/* Total Net Worth */}
          <div className="flex items-center justify-between pt-0.5 text-sm">
            <div className="flex items-center gap-2 text-primary">
              <Wallet className="size-4" />
              <span className="font-semibold text-foreground">{t('totalNetWorth')}</span>
            </div>
            <span className="text-base font-bold text-foreground">
              {formatCurrencyAmount(netWorth.total, baseCurrency, language)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
