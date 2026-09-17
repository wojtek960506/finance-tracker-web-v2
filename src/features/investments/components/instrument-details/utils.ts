import type { InvestmentOperation } from '@features/investments/api';

export type InstrumentMetrics = {
  currentValuation: number | null;
  lastSnapshotDate: string | null;
  netInvested: number;
  totalProfit: number | null;
  returnPercentage: number | null;
  totalOperationsCount: number;
};

export const calculateInstrumentMetrics = (
  operations: InvestmentOperation[],
): InstrumentMetrics => {
  const snapshots = operations
    .filter((op) => op.kind === 'snapshot')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const latestSnapshot = snapshots[0] ?? null;
  const currentValuation = latestSnapshot ? latestSnapshot.amount : null;
  const lastSnapshotDate = latestSnapshot ? latestSnapshot.date : null;

  let netInvested = 0;
  let hasCashFlows = false;

  for (const op of operations) {
    if (op.kind === 'snapshot') continue;
    hasCashFlows = true;

    if (op.kind === 'buy' || op.kind === 'fee') {
      netInvested += op.amount;
    } else if (op.kind === 'sell') {
      netInvested -= op.amount;
    } else if (op.kind === 'interest') {
      // Interest / dividend yield is a return payout
      netInvested -= op.amount;
    }
  }

  // If there are no cash flows but we have snapshots, netInvested stays 0
  const totalProfit =
    currentValuation !== null
      ? currentValuation - (hasCashFlows ? netInvested : 0)
      : null;

  const returnPercentage =
    totalProfit !== null && netInvested > 0 ? (totalProfit / netInvested) * 100 : null;

  return {
    currentValuation,
    lastSnapshotDate,
    netInvested: hasCashFlows ? netInvested : 0,
    totalProfit: hasCashFlows ? totalProfit : null,
    returnPercentage,
    totalOperationsCount: operations.length,
  };
};
