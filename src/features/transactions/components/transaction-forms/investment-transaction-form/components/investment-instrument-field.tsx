import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { InstrumentSelectField } from '@features/investments/components/instruments';
import { Label } from '@shared/ui';
import {
  FieldError,
  REQUIRED_LABEL_CLASS_NAME,
} from '@transactions/components/transaction-forms';

import type { InvestmentTransactionFormValues } from '../utils';

type InvestmentInstrumentFieldProps = {
  control: Control<InvestmentTransactionFormValues>;
  errorMessage?: string;
  onAddNewInstrument: () => void;
};

export const InvestmentInstrumentField = ({
  control,
  errorMessage,
  onAddNewInstrument,
}: InvestmentInstrumentFieldProps) => {
  const { t } = useTranslation('transactions');

  return (
    <Label className="sm:col-span-2">
      <span className={REQUIRED_LABEL_CLASS_NAME}>{t('investmentInstrument')}</span>
      <Controller
        control={control}
        name="instrumentId"
        render={({ field }) => (
          <InstrumentSelectField
            value={field.value}
            onChange={field.onChange}
            placeholder={t('selectInstrumentPlaceholder')}
            onAddNewInstrument={onAddNewInstrument}
          />
        )}
      />
      <FieldError message={errorMessage && t(errorMessage)} />
    </Label>
  );
};
