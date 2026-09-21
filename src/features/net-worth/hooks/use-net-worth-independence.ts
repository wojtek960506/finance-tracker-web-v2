import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { getNetWorthIndependence, type NetWorthIndependenceResponseDTO } from '../api';

export type UseNetWorthIndependenceOptions = {
  initialBaseCurrency?: string;
  baseCurrency?: string;
  initialPeriodMonths?: number;
};

export const useNetWorthIndependence = (options?: UseNetWorthIndependenceOptions) => {
  const [baseCurrencyState, setBaseCurrency] = useState<string>(
    options?.baseCurrency ?? options?.initialBaseCurrency ?? 'PLN',
  );
  const baseCurrency = options?.baseCurrency ?? baseCurrencyState;
  const [periodMonths, setPeriodMonths] = useState<number>(
    options?.initialPeriodMonths ?? 12,
  );

  const { data, isLoading, isFetching, error, refetch } =
    useQuery<NetWorthIndependenceResponseDTO>({
      queryKey: ['net-worth-independence', baseCurrency, periodMonths],
      queryFn: async () =>
        await getNetWorthIndependence({
          baseCurrency,
          periodMonths,
        }),
      staleTime: 1000 * 60 * 2, // 2 minutes
    });

  const period = data?.period ?? null;
  const netWorth = data?.netWorth ?? null;
  const monthlyAverages = data?.monthlyAverages ?? null;
  const independence = data?.independence ?? null;
  const zeroIncomeBaseline = data?.zeroIncomeBaseline ?? null;
  const excludedCategories = data?.excludedCategories ?? [];
  const isPerpetual = independence?.isPerpetual ?? false;

  const hasData = Boolean(
    data &&
    (netWorth?.total !== 0 ||
      netWorth?.liquidCash !== 0 ||
      monthlyAverages?.grossExpenses !== 0 ||
      monthlyAverages?.totalIncome !== 0),
  );

  return {
    data,
    baseCurrency,
    setBaseCurrency,
    periodMonths,
    setPeriodMonths,
    period,
    netWorth,
    monthlyAverages,
    independence,
    zeroIncomeBaseline,
    excludedCategories,
    isPerpetual,
    hasData,
    isLoading,
    isFetching,
    error,
    refetch,
  };
};
