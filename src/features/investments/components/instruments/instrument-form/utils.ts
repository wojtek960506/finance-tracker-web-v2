import { z } from 'zod';

import type {
  InvestmentInstrument,
  InvestmentInstrumentKind,
} from '@features/investments/api';
import { DEFAULT_INSTRUMENT_KIND } from '@features/investments/consts';

export const instrumentFormSchema = z.object({
  name: z.string().trim().min(1, 'nameRequired'),
  kind: z.enum(['share', 'fund', 'termDeposit', 'savings']),
  currency: z.string().trim().min(1, 'currencyRequired'),
  notes: z.string().trim(),
});

export type InstrumentFormValues = z.infer<typeof instrumentFormSchema>;

export const getDefaultInstrumentFormValues = (
  defaultCurrency = '',
): InstrumentFormValues => ({
  name: '',
  kind: DEFAULT_INSTRUMENT_KIND,
  currency: defaultCurrency,
  notes: '',
});

export const getInstrumentFormValuesFromEntity = (
  instrument: InvestmentInstrument,
): InstrumentFormValues => ({
  name: instrument.name,
  kind: (instrument.kind as InvestmentInstrumentKind) || DEFAULT_INSTRUMENT_KIND,
  currency: instrument.currency || '',
  notes: instrument.notes || '',
});
