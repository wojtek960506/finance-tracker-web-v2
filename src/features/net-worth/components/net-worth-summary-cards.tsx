import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';

import type { NetWorthTotalsDTO } from '../api';

import { NetWorthSummaryCard } from './net-worth-summary-card';

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
      className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3"
      data-testid="net-worth-summary-cards"
    >
      <NetWorthSummaryCard
        variant="total"
        title={t('totalNetWorth')}
        amount={totals.total}
        baseCurrency={baseCurrency}
        language={language}
        className="md:col-span-2 lg:col-span-1"
      />

      <NetWorthSummaryCard
        variant="liquid"
        title={t('liquidCash')}
        amount={totals.liquidCash}
        baseCurrency={baseCurrency}
        language={language}
        percentage={liquidPercentage}
        description={t('liquidCashDescription')}
      />

      <NetWorthSummaryCard
        variant="investments"
        title={t('investments')}
        amount={totals.investments}
        baseCurrency={baseCurrency}
        language={language}
        percentage={investmentPercentage}
        description={t('investmentsDescription')}
      />
    </div>
  );
};
