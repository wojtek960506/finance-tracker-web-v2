import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getCurrencies } from '@features/currencies/api';
import { SearchableSelect } from '@shared/ui';

type CurrencySelectFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
};

export const CurrencySelectField = ({
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
}: CurrencySelectFieldProps) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['currencies'],
    queryFn: async () => await getCurrencies(),
  });

  const groups = useMemo(
    () => [
      {
        key: 'currencies',
        options: data.map((currency) => ({
          value: currency.code,
          label: currency.code,
          hint: currency.name,
          searchText: currency.name,
        })),
      },
    ],
    [data],
  );

  return (
    <SearchableSelect
      value={value}
      onChange={onChange}
      groups={groups}
      placeholder={isLoading ? 'Loading...' : placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={emptyMessage}
      disabled={isLoading}
    />
  );
};
