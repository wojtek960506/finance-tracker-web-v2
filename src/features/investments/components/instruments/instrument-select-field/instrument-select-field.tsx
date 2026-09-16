import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Plus } from 'lucide-react';
import { useState } from 'react';
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
  addNewPlacement?: 'side' | 'menu';
};

export const InstrumentSelectField = ({
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  showClear = true,
  onAddNewInstrument,
  addNewPlacement = 'side',
}: InstrumentSelectFieldProps) => {
  const { t } = useTranslation('investments');
  const [open, setOpen] = useState(false);

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
          open={open}
          onOpenChange={setOpen}
          itemToStringLabel={(inst) => inst.name}
          itemToStringValue={formatInstrumentLabel}
          onValueChange={(inst) => onChange(inst?.id ?? '')}
        >
          <ComboboxInput
            className="w-full"
            placeholder={
              isLoading
                ? t('loading')
                : searchPlaceholder || placeholder || t('selectInstrumentPlaceholder')
            }
            disabled={isLoading}
            showClear={showClear}
          />
          <ComboboxContent>
            {onAddNewInstrument && addNewPlacement === 'menu' && (
              <div className="border-b border-fg/10 p-1">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    onAddNewInstrument();
                  }}
                  title={t('addNewInstrument')}
                  aria-label={t('addNewInstrument')}
                  className={clsx(
                    'flex h-8 w-full items-center justify-start gap-2 rounded-lg',
                    'px-2 text-xs font-medium text-primary hover:bg-bg whitespace-nowrap',
                  )}
                >
                  <Plus className="size-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{t('addNewInstrument')}</span>
                </Button>
              </div>
            )}
            <ComboboxEmpty>{emptyMessage || t('noInstrumentsFound')}</ComboboxEmpty>
            <ComboboxList>
              {(inst) => (
                <ComboboxItem key={inst.id} value={inst} className="whitespace-nowrap">
                  <div className="flex w-full items-center justify-between gap-4 whitespace-nowrap">
                    <span className="font-medium whitespace-nowrap">{inst.name}</span>
                    <div className="flex shrink-0 items-center gap-1.5">
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

      {onAddNewInstrument && addNewPlacement === 'side' ? (
        <Button
          type="button"
          variant="outline"
          onClick={onAddNewInstrument}
          title={t('addNewInstrument')}
          aria-label={t('addNewInstrument')}
          className="shrink-0 gap-1 px-3 py-1 text-xs"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">{t('quickAdd')}</span>
        </Button>
      ) : null}
    </div>
  );
};
