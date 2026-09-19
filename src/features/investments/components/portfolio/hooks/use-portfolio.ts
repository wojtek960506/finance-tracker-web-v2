import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import {
  getInvestmentSummary,
  type InvestmentCurrencySummary,
  type InvestmentInstrumentSummary,
  type InvestmentSummaryResponse,
} from '@features/investments/api';

export const usePortfolio = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);

  const { data, isLoading, isFetching, error, refetch } =
    useQuery<InvestmentSummaryResponse>({
      queryKey: ['investments-summary'],
      queryFn: async () => await getInvestmentSummary(),
    });

  const totalsByCurrency = data?.totalsByCurrency;
  const rawInstruments = data?.instruments;

  const currencies = useMemo(() => {
    if (!totalsByCurrency) return [];
    return Object.keys(totalsByCurrency).sort();
  }, [totalsByCurrency]);

  const activeCurrency = useMemo(() => {
    if (selectedCurrency && currencies.includes(selectedCurrency)) {
      return selectedCurrency;
    }
    return currencies[0] ?? null;
  }, [selectedCurrency, currencies]);

  const currentCurrencySummary: InvestmentCurrencySummary | null = useMemo(() => {
    if (!totalsByCurrency || !activeCurrency) return null;
    return totalsByCurrency[activeCurrency] ?? null;
  }, [totalsByCurrency, activeCurrency]);

  const filteredInstruments: InvestmentInstrumentSummary[] = useMemo(() => {
    if (!rawInstruments) return [];
    if (!activeCurrency) return rawInstruments;
    return rawInstruments.filter((inst) => inst.currency === activeCurrency);
  }, [rawInstruments, activeCurrency]);

  const hasHoldings = Boolean(data && data.instruments && data.instruments.length > 0);

  return {
    summary: data,
    currencies,
    activeCurrency,
    setActiveCurrency: setSelectedCurrency,
    currentCurrencySummary,
    instruments: filteredInstruments,
    allInstruments: rawInstruments ?? [],
    hasHoldings,
    isLoading,
    isFetching,
    error,
    refetch,
  };
};
