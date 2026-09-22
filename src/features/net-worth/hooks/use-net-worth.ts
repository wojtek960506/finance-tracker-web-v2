import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import {
  getNetWorth,
  type NetWorthAllocationItemDTO,
  type NetWorthCurrencyBreakdownDTO,
  type NetWorthResponseDTO,
  type NetWorthTotalsDTO,
} from '../api';

export type UseNetWorthOptions = {
  initialBaseCurrency?: string;
};

export const useNetWorth = (options?: UseNetWorthOptions) => {
  const [baseCurrency, setBaseCurrency] = useState<string>(
    options?.initialBaseCurrency ?? 'PLN',
  );

  const { data, isLoading, isFetching, error, refetch } = useQuery<NetWorthResponseDTO>({
    queryKey: ['net-worth', baseCurrency],
    queryFn: async () => await getNetWorth({ baseCurrency }),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const totals: NetWorthTotalsDTO | null = data?.netWorth ?? null;
  const byCurrency = data?.byCurrency;
  const allocation = data?.allocation;

  const currencies: string[] = useMemo(() => {
    if (!byCurrency) return [];
    return Object.values(byCurrency)
      .filter((item) => item.total !== 0 || item.cash !== 0 || item.investments !== 0)
      .map((item) => item.currency)
      .sort();
  }, [byCurrency]);

  const byCurrencyList: NetWorthCurrencyBreakdownDTO[] = useMemo(() => {
    if (!byCurrency) return [];
    return Object.values(byCurrency)
      .filter((item) => item.total !== 0 || item.cash !== 0 || item.investments !== 0)
      .sort((a, b) => a.currency.localeCompare(b.currency));
  }, [byCurrency]);

  const allocationList: NetWorthAllocationItemDTO[] = useMemo(() => {
    if (!allocation) return [];
    return Object.values(allocation)
      .filter((item) => item.amount !== 0 || item.percentage !== 0)
      .sort((a, b) => b.percentage - a.percentage);
  }, [allocation]);

  const hasData = Boolean(
    data &&
    (data.netWorth.total !== 0 ||
      data.netWorth.liquidCash !== 0 ||
      data.netWorth.investments !== 0 ||
      byCurrencyList.length > 0 ||
      allocationList.length > 0),
  );

  return {
    data,
    baseCurrency,
    setBaseCurrency,
    totals,
    currencies,
    byCurrencyList,
    allocationList,
    hasData,
    isLoading,
    isFetching,
    error,
    refetch,
  };
};
