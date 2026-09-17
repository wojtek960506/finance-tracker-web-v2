import { describe, expect, it } from 'vitest';

import type { InvestmentOperation } from '@features/investments/api';

import { calculateInstrumentMetrics } from './utils';

describe('calculateInstrumentMetrics', () => {
  it('returns zeros/nulls for empty operations list', () => {
    const metrics = calculateInstrumentMetrics([]);
    expect(metrics).toEqual({
      currentValuation: null,
      lastSnapshotDate: null,
      netInvested: 0,
      totalProfit: null,
      returnPercentage: null,
      totalOperationsCount: 0,
    });
  });

  it('calculates metrics correctly for snapshots and buys', () => {
    const operations: InvestmentOperation[] = [
      {
        id: 'op-1',
        kind: 'buy',
        transactionId: 'tx-1',
        instrumentId: 'inst-1',
        amount: 1000,
        currency: 'USD',
        date: '2026-01-10',
        ownerId: 'u-1',
        createdAt: '2026-01-10T00:00:00Z',
        updatedAt: '2026-01-10T00:00:00Z',
      },
      {
        id: 'op-2',
        kind: 'fee',
        transactionId: 'tx-2',
        instrumentId: 'inst-1',
        amount: 50,
        currency: 'USD',
        date: '2026-01-10',
        ownerId: 'u-1',
        createdAt: '2026-01-10T00:00:00Z',
        updatedAt: '2026-01-10T00:00:00Z',
      },
      {
        id: 'op-3',
        kind: 'snapshot',
        instrumentId: 'inst-1',
        amount: 1200,
        currency: 'USD',
        date: '2026-02-01',
        ownerId: 'u-1',
        createdAt: '2026-02-01T00:00:00Z',
        updatedAt: '2026-02-01T00:00:00Z',
      },
    ];

    const metrics = calculateInstrumentMetrics(operations);
    expect(metrics.currentValuation).toBe(1200);
    expect(metrics.lastSnapshotDate).toBe('2026-02-01');
    expect(metrics.netInvested).toBe(1050); // 1000 buy + 50 fee
    expect(metrics.totalProfit).toBe(150); // 1200 - 1050
    expect(metrics.returnPercentage).toBeCloseTo(14.2857, 2); // 150 / 1050 * 100
    expect(metrics.totalOperationsCount).toBe(3);
  });

  it('handles sell and interest operations', () => {
    const operations: InvestmentOperation[] = [
      {
        id: 'op-1',
        kind: 'buy',
        transactionId: 'tx-1',
        instrumentId: 'inst-1',
        amount: 2000,
        currency: 'USD',
        date: '2026-01-10',
        ownerId: 'u-1',
        createdAt: '2026-01-10T00:00:00Z',
        updatedAt: '2026-01-10T00:00:00Z',
      },
      {
        id: 'op-2',
        kind: 'sell',
        transactionId: 'tx-2',
        instrumentId: 'inst-1',
        amount: 500,
        currency: 'USD',
        date: '2026-01-20',
        ownerId: 'u-1',
        createdAt: '2026-01-20T00:00:00Z',
        updatedAt: '2026-01-20T00:00:00Z',
      },
      {
        id: 'op-3',
        kind: 'snapshot',
        instrumentId: 'inst-1',
        amount: 1800,
        currency: 'USD',
        date: '2026-02-01',
        ownerId: 'u-1',
        createdAt: '2026-02-01T00:00:00Z',
        updatedAt: '2026-02-01T00:00:00Z',
      },
    ];

    const metrics = calculateInstrumentMetrics(operations);
    expect(metrics.netInvested).toBe(1500); // 2000 - 500
    expect(metrics.totalProfit).toBe(300); // 1800 - 1500
    expect(metrics.returnPercentage).toBe(20); // 300 / 1500 * 100
  });

  it('selects latest snapshot when multiple exist', () => {
    const operations: InvestmentOperation[] = [
      {
        id: 'op-1',
        kind: 'snapshot',
        instrumentId: 'inst-1',
        amount: 1000,
        currency: 'USD',
        date: '2026-01-01',
        ownerId: 'u-1',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'op-2',
        kind: 'snapshot',
        instrumentId: 'inst-1',
        amount: 1500,
        currency: 'USD',
        date: '2026-03-01',
        ownerId: 'u-1',
        createdAt: '2026-03-01T00:00:00Z',
        updatedAt: '2026-03-01T00:00:00Z',
      },
      {
        id: 'op-3',
        kind: 'snapshot',
        instrumentId: 'inst-1',
        amount: 1200,
        currency: 'USD',
        date: '2026-02-01',
        ownerId: 'u-1',
        createdAt: '2026-02-01T00:00:00Z',
        updatedAt: '2026-02-01T00:00:00Z',
      },
    ];

    const metrics = calculateInstrumentMetrics(operations);
    expect(metrics.currentValuation).toBe(1500);
    expect(metrics.lastSnapshotDate).toBe('2026-03-01');
  });
});
