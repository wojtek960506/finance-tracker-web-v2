import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';

import type {
  NetWorthIndependenceHorizonDTO,
  NetWorthIndependenceMonthlyAveragesDTO,
  NetWorthZeroIncomeBaselineDTO,
} from '../api';
import {
  formatCurrencyAmount,
  formatHorizonYearsAndMonths,
  formatTruncatedDecimal,
} from '../utils';

import { NetWorthIndependenceCard } from './net-worth-independence-card';

type NetWorthIndependenceCardsProps = {
  independence: NetWorthIndependenceHorizonDTO;
  zeroIncomeBaseline: NetWorthZeroIncomeBaselineDTO;
  monthlyAverages: NetWorthIndependenceMonthlyAveragesDTO;
  baseCurrency?: string;
};

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
  const zeroIncomeMonths = zeroIncomeBaseline.netWorthMonths;
  const liquidCapitalMonths = independence.liquidCapitalMonths;

  return (
    <div
      className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
      data-testid="net-worth-independence-cards"
    >
      {/* 1. Financial Independence Horizon */}
      <NetWorthIndependenceCard
        variant="horizon"
        title={t('financialIndependence')}
        value={
          isPerpetual
            ? '∞'
            : netWorthMonths !== null
              ? formatTruncatedDecimal(netWorthMonths, language)
              : '—'
        }
        unit={
          !isPerpetual && netWorthMonths !== null
            ? t('monthsUnit', { count: netWorthMonths })
            : undefined
        }
        secondaryValue={
          isPerpetual
            ? t('perpetualHorizon')
            : netWorthMonths !== null
              ? formatHorizonYearsAndMonths(netWorthMonths, t)
              : '—'
        }
        description={
          isPerpetual ? t('perpetualSubtitle') : t('financialIndependenceDescription')
        }
      />

      {/* 2. Conservative 0-Income Baseline */}
      <NetWorthIndependenceCard
        variant="zeroIncome"
        title={t('zeroIncomeBaseline')}
        value={
          zeroIncomeMonths !== null
            ? formatTruncatedDecimal(zeroIncomeMonths, language)
            : '—'
        }
        unit={
          zeroIncomeMonths !== null
            ? t('monthsUnit', { count: zeroIncomeMonths })
            : undefined
        }
        secondaryValue={
          zeroIncomeMonths !== null
            ? formatHorizonYearsAndMonths(zeroIncomeMonths, t)
            : '—'
        }
        description={t('zeroIncomeBaselineDescription')}
      />

      {/* 3. Liquid Safety Buffer */}
      <NetWorthIndependenceCard
        variant="liquidBuffer"
        title={t('liquidSafetyBuffer')}
        value={
          isPerpetual
            ? '∞'
            : liquidCapitalMonths !== null
              ? formatTruncatedDecimal(liquidCapitalMonths, language)
              : '—'
        }
        unit={
          !isPerpetual && liquidCapitalMonths !== null
            ? t('monthsUnit', { count: liquidCapitalMonths })
            : undefined
        }
        secondaryValue={
          isPerpetual
            ? t('perpetualHorizon')
            : liquidCapitalMonths !== null
              ? formatHorizonYearsAndMonths(liquidCapitalMonths, t)
              : '—'
        }
        description={
          isPerpetual ? t('perpetualSubtitle') : t('liquidSafetyBufferDescription')
        }
      />

      {/* 4. Net Burn Rate */}
      <NetWorthIndependenceCard
        variant="burnRate"
        title={t('netBurnRate')}
        value={formatCurrencyAmount(monthlyAverages.netBurnRate, baseCurrency, language)}
        unit={`/ ${t('perMonth')}`}
        secondaryValue=""
        description={t('netBurnRateDescription')}
      />
    </div>
  );
};
