import { Landmark, Layers, PiggyBank, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import { Card } from '@shared/ui';

import type { NetWorthIndependenceCapitalDTO } from '../api';
import { formatCurrencyAmount } from '../utils';

import { NetWorthBreakdownRow } from './net-worth-breakdown-row';

export type CapitalStructureProps = {
  netWorth: NetWorthIndependenceCapitalDTO;
  baseCurrency?: string;
};

export const CapitalStructure = ({ netWorth, baseCurrency }: CapitalStructureProps) => {
  const { t } = useTranslation('net-worth');
  const { language } = useLanguage();

  return (
    <Card className="flex flex-col gap-4 p-4 sm:p-5">
      <h3 className="text-sm font-semibold tracking-tight text-foreground">
        {t('assetAllocation')}
      </h3>

      <div className="flex flex-col gap-3">
        <NetWorthBreakdownRow
          icon={Landmark}
          iconClass="text-amber-500"
          label={t('bankCashOnly')}
          value={formatCurrencyAmount(netWorth.liquidCash, baseCurrency, language)}
        />

        <NetWorthBreakdownRow
          icon={PiggyBank}
          iconClass="text-pink-600"
          label={t('categories.savings')}
          value={formatCurrencyAmount(netWorth.savings, baseCurrency, language)}
        />

        <NetWorthBreakdownRow
          icon={Wallet}
          iconClass="text-sky-500"
          label={t('liquidCapital')}
          value={formatCurrencyAmount(netWorth.liquidCapital, baseCurrency, language)}
          valueClass="font-bold text-sky-600 dark:text-sky-400"
        />

        <NetWorthBreakdownRow
          icon={Layers}
          iconClass="text-indigo-500"
          label={t('lockedInvestments')}
          value={formatCurrencyAmount(netWorth.lockedInvestments, baseCurrency, language)}
        />

        <NetWorthBreakdownRow
          icon={Wallet}
          iconClass="text-emerald-500"
          label={t('totalNetWorth')}
          labelClass="font-semibold text-foreground"
          value={formatCurrencyAmount(netWorth.total, baseCurrency, language)}
          valueClass="text-base font-bold text-emerald-600 dark:text-emerald-400"
          hasBorder={false}
        />
      </div>
    </Card>
  );
};
