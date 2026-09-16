import type { InvestmentInstrumentKind } from './api/types';

export const INSTRUMENT_KINDS: InvestmentInstrumentKind[] = [
  'share',
  'fund',
  'termDeposit',
  'savings',
] as const;

export const DEFAULT_INSTRUMENT_KIND: InvestmentInstrumentKind = 'share';
