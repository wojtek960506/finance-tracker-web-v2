import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { getInstruments, type InvestmentInstrument } from '@features/investments/api';
import { Button } from '@shared/ui';

import { InstrumentKindBadge } from '../instrument-kind-badge';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';

type InstrumentSelectFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  showClear?: boolean;
  onAddNewInstrument?: () => void;
};

export const InstrumentSelectField = ({
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  showClear = true,
  onAddNewInstrument,
}: InstrumentSelectFieldProps) => {
  const { t } = useTranslation('investments');

  const { data = [], isLoading } = useQuery({
    queryKey: ['instruments'],
    queryFn: async () => await getInstruments(),
  });

  const selectedInstrument = data.find((inst) => inst.id === value) ?? null;

  const formatInstrumentLabel = (inst: InvestmentInstrument) =>
    `${inst.name} ${inst.kind}`;

  return (
    <div className="flex w-full items-center gap-2" data-testid="instrument-select-field">
      <div className="flex-1">
        <Combobox<InvestmentInstrument>
          items={data}
          value={selectedInstrument}
          disabled={isLoading}
          itemToStringLabel={(inst) => inst.name}
          itemToStringValue={formatInstrumentLabel}
          onValueChange={(inst) => onChange(inst?.id ?? '')}
        >
          <ComboboxInput
            className="w-full"
            placeholder={
              isLoading
                ? t('loading', { defaultValue: 'Loading instruments...' })
                : searchPlaceholder ||
                  placeholder ||
                  t('selectInstrumentPlaceholder', {
                    defaultValue: 'Select instrument...',
                  })
            }
            disabled={isLoading}
            showClear={showClear}
          />
          <ComboboxContent>
            <ComboboxEmpty>
              {emptyMessage ||
                t('noInstrumentsFound', { defaultValue: 'No instruments found' })}
            </ComboboxEmpty>
            <ComboboxList>
              {(inst) => (
                <ComboboxItem key={inst.id} value={inst}>
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="font-medium">{inst.name}</span>
                    <div className="flex items-center gap-1.5">
                      <InstrumentKindBadge kind={inst.kind} />
                      {inst.currency ? (
                        <span className="text-xs text-text-muted">{inst.currency}</span>
                      ) : null}
                    </div>
                  </div>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      {onAddNewInstrument ? (
        <Button
          type="button"
          variant="outline"
          onClick={onAddNewInstrument}
          title={t('addNewInstrument', { defaultValue: 'Create new instrument' })}
          aria-label={t('addNewInstrument', { defaultValue: 'Create new instrument' })}
          className="shrink-0 gap-1 px-3 py-1 text-xs"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">
            {t('quickAdd', { defaultValue: 'New' })}
          </span>
        </Button>
      ) : null}
    </div>
  );
};
