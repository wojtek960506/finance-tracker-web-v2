import type { InvestmentInstrumentKind, InvestmentOperationKind } from './api/types';

export const INSTRUMENT_KINDS: InvestmentInstrumentKind[] = [
  'share',
  'fund',
  'termDeposit',
  'savings',
] as const;

export const DEFAULT_INSTRUMENT_KIND: InvestmentInstrumentKind = 'share';

export const OPERATION_KINDS: InvestmentOperationKind[] = [
  'snapshot',
  'buy',
  'sell',
  'interest',
  'fee',
] as const;
