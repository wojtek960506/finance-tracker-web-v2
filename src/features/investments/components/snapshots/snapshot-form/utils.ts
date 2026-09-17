import { z } from 'zod';

import type { InvestmentSnapshotOperation } from '@features/investments/api';

export const snapshotFormSchema = z.object({
  instrumentId: z.string().trim().min(1, 'instrumentRequired'),
  amount: z.number({ message: 'amountRequired' }).nonnegative('amountPositive'),
  currency: z.string().trim().min(1, 'currencyRequired'),
  date: z.string().trim().min(1, 'dateRequired'),
  note: z.string().trim().optional(),
});

export type SnapshotFormValues = z.infer<typeof snapshotFormSchema>;

export const getDefaultSnapshotFormValues = (
  defaultInstrumentId = '',
  defaultCurrency = '',
): SnapshotFormValues => ({
  instrumentId: defaultInstrumentId,
  amount: undefined as unknown as number,
  currency: defaultCurrency,
  date: new Date().toISOString().slice(0, 10),
  note: '',
});

export const getSnapshotFormValuesFromEntity = (
  snapshot: InvestmentSnapshotOperation,
): SnapshotFormValues => ({
  instrumentId: snapshot.instrumentId,
  amount: snapshot.amount,
  currency: snapshot.currency,
  date: snapshot.date.slice(0, 10),
  note: snapshot.note || '',
});
