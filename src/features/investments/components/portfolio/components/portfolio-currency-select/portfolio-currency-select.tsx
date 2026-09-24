import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useMemo } from 'react';

import { getCurrencies } from '@features/currencies/api';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type PortfolioCurrencySelectProps = {
  currencies: string[];
  activeCurrency: string | null;
  onSelectCurrency: (currency: string) => void;
};

export const PortfolioCurrencySelect = ({
  currencies,
  activeCurrency,
  onSelectCurrency,
}: PortfolioCurrencySelectProps) => {
  const { data: allCurrencies = [] } = useQuery({
    queryKey: ['currencies'],
    queryFn: async () => await getCurrencies(),
  });

  const currencyMap = useMemo(() => {
    return new Map(allCurrencies.map((c) => [c.code, c.name]));
  }, [allCurrencies]);

  if (currencies.length <= 1) return null;

  return (
    <Select value={activeCurrency ?? currencies[0]} onValueChange={onSelectCurrency}>
      <SelectTrigger
        className={clsx(
          'h-full min-h-10 w-fit shrink-0 rounded-lg sm:min-h-11 sm:w-28 sm:rounded-xl',
          'text-xs font-semibold uppercase tracking-wider sm:text-sm',
        )}
        data-testid="portfolio-currency-select"
      >
        <SelectValue>{activeCurrency ?? currencies[0]}</SelectValue>
      </SelectTrigger>
      <SelectContent className="min-w-48">
        {currencies.map((currency) => {
          const currencyName = currencyMap.get(currency);

          return (
            <SelectItem key={currency} value={currency} className="text-xs font-medium">
              <span className="flex items-center gap-2">
                <span className="font-semibold uppercase">{currency}</span>
                {currencyName && (
                  <span className="text-xs text-text-muted">{currencyName}</span>
                )}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
