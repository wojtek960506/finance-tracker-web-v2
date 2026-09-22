import { z } from 'zod';

import type {
  InvestmentInstrumentKind,
  InvestmentOperation,
  StandaloneInvestmentOperationKind,
} from '@features/investments/api';

export const isSnapshotOnlyInstrument = (kind?: InvestmentInstrumentKind) =>
  kind === 'share' || kind === 'fund';

export const isCashFlowOnlyInstrument = (kind?: InvestmentInstrumentKind) =>
  kind === 'termDeposit' || kind === 'savings';

export const operationFormSchema = z.object({
  instrumentId: z.string().trim().min(1, 'instrumentRequired'),
  kind: z.enum(['snapshot', 'interest', 'fee']),
  amount: z.number({ message: 'amountRequired' }).nonnegative('amountPositive'),
  currency: z.string().trim().min(1, 'currencyRequired'),
  date: z.string().trim().min(1, 'dateRequired'),
  note: z.string().trim(),
});

export type OperationFormValues = z.infer<typeof operationFormSchema>;

export const getDefaultOperationFormValues = (
  defaultInstrumentId = '',
  defaultCurrency = '',
  defaultKind: StandaloneInvestmentOperationKind = 'snapshot',
): OperationFormValues => ({
  instrumentId: defaultInstrumentId,
  kind: defaultKind,
  amount: undefined as unknown as number,
  currency: defaultCurrency,
  date: new Date().toISOString().slice(0, 10),
  note: '',
});

export const getOperationFormValuesFromEntity = (
  operation: InvestmentOperation,
): OperationFormValues => ({
  instrumentId: operation.instrumentId,
  kind: (operation.kind === 'interest' || operation.kind === 'fee'
    ? operation.kind
    : 'snapshot') as StandaloneInvestmentOperationKind,
  amount: operation.amount,
  currency: operation.currency,
  date: operation.date.slice(0, 10),
  note: operation.note || '',
});
