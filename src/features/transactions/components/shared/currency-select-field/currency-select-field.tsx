import { useQuery } from '@tanstack/react-query';

import { getCurrencies } from '@features/currencies/api';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';

type CurrencyOption = {
  code: string;
  name: string;
};

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
  const selectedCurrency = data.find((currency) => currency.code === value) ?? null;
  const formatCurrencyLabel = (currency: CurrencyOption) =>
    `${currency.code} ${currency.name}`;

  return (
    <Combobox<CurrencyOption>
      items={data}
      value={selectedCurrency}
      disabled={isLoading}
      itemToStringLabel={formatCurrencyLabel}
      itemToStringValue={formatCurrencyLabel}
      onValueChange={(currency) => onChange(currency?.code ?? '')}
    >
      <ComboboxInput
        className="w-full"
        placeholder={isLoading ? 'Loading...' : searchPlaceholder || placeholder}
        disabled={isLoading}
        showClear
      />
      <ComboboxContent>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {(currency) => (
            <ComboboxItem key={currency.code} value={currency}>
              <span className="flex items-center gap-2">
                <span>{currency.code}</span>
                <span className="text-xs text-text-muted">{currency.name}</span>
              </span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};
