import { ArrowDownRight, ArrowUpRight, Ban } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import { Card } from '@shared/ui';

import type {
  ExcludedCategoryItemDTO,
  NetWorthIndependenceMonthlyAveragesDTO,
} from '../api';
import { formatCurrencyAmount } from '../utils';

import { NetWorthBreakdownRow } from './net-worth-breakdown-row';

export type MonthlyCashflowDynamicsProps = {
  monthlyAverages: NetWorthIndependenceMonthlyAveragesDTO;
  excludedCategories: ExcludedCategoryItemDTO[];
  baseCurrency?: string;
};

export const MonthlyCashflowDynamics = ({
  monthlyAverages,
  excludedCategories,
  baseCurrency,
}: MonthlyCashflowDynamicsProps) => {
  const { t } = useTranslation('net-worth');
  const { language } = useLanguage();

  return (
    <Card className="flex flex-col gap-4 p-4 sm:p-5">
      <h3 className="text-sm font-semibold tracking-tight text-foreground">
        {t('detailsTitle')}
      </h3>

      <div className="flex flex-col gap-3">
        <NetWorthBreakdownRow
          icon={ArrowDownRight}
          iconClass="text-rose-500"
          label={t('grossExpenses')}
          value={`-${formatCurrencyAmount(
            monthlyAverages.grossExpenses,
            baseCurrency,
            language,
          )}`}
          valueClass="font-semibold text-rose-600 dark:text-rose-400"
        />

        <NetWorthBreakdownRow
          icon={ArrowUpRight}
          iconClass="text-emerald-500"
          label={t('nonWorkIncome')}
          value={`+${formatCurrencyAmount(
            monthlyAverages.nonWorkIncome,
            baseCurrency,
            language,
          )}`}
          valueClass="font-semibold text-emerald-600 dark:text-emerald-400"
        />

        <NetWorthBreakdownRow
          icon={Ban}
          iconClass="text-text-muted"
          label={t('workIncomeExcluded')}
          value={formatCurrencyAmount(monthlyAverages.workIncome, baseCurrency, language)}
          valueClass="font-medium text-text-muted"
        />
      </div>

      {excludedCategories.length > 0 && (
        <div className="border-t border-t-fg flex flex-wrap items-center gap-1.5 pt-1.5 mt-1">
          <span className="text-xs text-text-muted">{t('excludedCategoriesLabel')}:</span>
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
  );
};
