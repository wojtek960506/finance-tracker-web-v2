import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import {
  createInstrument,
  createSnapshotOperation,
  deleteInstrument,
  deleteOperation,
  getInstrument,
  getInstruments,
  getOperations,
  type InvestmentInstrument,
  type InvestmentOperation,
  type InvestmentSnapshotOperation,
  updateInstrument,
  updateSnapshotOperation,
} from './index';

vi.mock('@shared/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockInstrument: InvestmentInstrument = {
  id: 'inst-1',
  name: 'Apple Inc.',
  nameNormalized: 'apple inc.',
  kind: 'share',
  currency: 'USD',
  notes: 'Tech stock',
  ownerId: 'user-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const mockSnapshot: InvestmentSnapshotOperation = {
  id: 'op-1',
  kind: 'snapshot',
  ownerId: 'user-1',
  instrumentId: 'inst-1',
  amount: 1500,
  currency: 'USD',
  date: '2026-02-01T00:00:00.000Z',
  note: 'Monthly checkpoint',
  createdAt: '2026-02-01T00:00:00.000Z',
  updatedAt: '2026-02-01T00:00:00.000Z',
};

const mockCashFlow: InvestmentOperation = {
  id: 'op-2',
  kind: 'buy',
  transactionId: 'tx-1',
  ownerId: 'user-1',
  instrumentId: 'inst-1',
  amount: 500,
  currency: 'USD',
  date: '2026-01-15T00:00:00.000Z',
  note: 'Initial buy',
  createdAt: '2026-01-15T00:00:00.000Z',
  updatedAt: '2026-01-15T00:00:00.000Z',
};

describe('investments api', () => {
  describe('instruments', () => {
    it('fetches instruments list without query', async () => {
      const getMock = vi.mocked(api.get);
      getMock.mockResolvedValueOnce({ data: [mockInstrument] });

      const result = await getInstruments();

      expect(getMock).toHaveBeenCalledWith('/investments/instruments', {
        params: undefined,
      });
      expect(result).toEqual([mockInstrument]);
    });

    it('fetches instruments list with query params', async () => {
      const getMock = vi.mocked(api.get);
      getMock.mockResolvedValueOnce({ data: [mockInstrument] });

      const query = { kind: 'share' as const, currency: 'USD', search: 'Apple' };
      const result = await getInstruments(query);

      expect(getMock).toHaveBeenCalledWith('/investments/instruments', {
        params: query,
      });
      expect(result).toEqual([mockInstrument]);
    });

    it('creates an instrument', async () => {
      const postMock = vi.mocked(api.post);
      postMock.mockResolvedValueOnce({ data: mockInstrument });

      const payload = { name: 'Apple Inc.', kind: 'share' as const, currency: 'USD' };
      const result = await createInstrument(payload);

      expect(postMock).toHaveBeenCalledWith('/investments/instruments', payload);
      expect(result).toEqual(mockInstrument);
    });

    it('gets a single instrument by id', async () => {
      const getMock = vi.mocked(api.get);
      getMock.mockResolvedValueOnce({ data: mockInstrument });

      const result = await getInstrument('inst-1');

      expect(getMock).toHaveBeenCalledWith('/investments/instruments/inst-1');
      expect(result).toEqual(mockInstrument);
    });

    it('updates an instrument', async () => {
      const patchMock = vi.mocked(api.patch);
      patchMock.mockResolvedValueOnce({
        data: { ...mockInstrument, name: 'Apple Updated' },
      });

      const payload = { name: 'Apple Updated' };
      const result = await updateInstrument('inst-1', payload);

      expect(patchMock).toHaveBeenCalledWith('/investments/instruments/inst-1', payload);
      expect(result).toEqual({ ...mockInstrument, name: 'Apple Updated' });
    });

    it('deletes an instrument', async () => {
      const deleteMock = vi.mocked(api.delete);
      deleteMock.mockResolvedValueOnce({ data: { acknowledged: true, deletedCount: 1 } });

      const result = await deleteInstrument('inst-1');

      expect(deleteMock).toHaveBeenCalledWith('/investments/instruments/inst-1');
      expect(result).toEqual({ acknowledged: true, deletedCount: 1 });
    });
  });

  describe('operations', () => {
    it('fetches operations list with filters', async () => {
      const getMock = vi.mocked(api.get);
      getMock.mockResolvedValueOnce({ data: [mockCashFlow, mockSnapshot] });

      const query = { instrumentId: 'inst-1', kind: 'buy' as const };
      const result = await getOperations(query);

      expect(getMock).toHaveBeenCalledWith('/investments/operations', {
        params: query,
      });
      expect(result).toEqual([mockCashFlow, mockSnapshot]);
    });

    it('creates a balance snapshot operation', async () => {
      const postMock = vi.mocked(api.post);
      postMock.mockResolvedValueOnce({ data: mockSnapshot });

      const payload = {
        instrumentId: 'inst-1',
        amount: 1500,
        currency: 'USD',
        date: '2026-02-01T00:00:00.000Z',
        note: 'Monthly checkpoint',
      };
      const result = await createSnapshotOperation(payload);

      expect(postMock).toHaveBeenCalledWith('/investments/operations', payload);
      expect(result).toEqual(mockSnapshot);
    });

    it('updates a balance snapshot operation', async () => {
      const patchMock = vi.mocked(api.patch);
      patchMock.mockResolvedValueOnce({
        data: { ...mockSnapshot, amount: 2000 },
      });

      const payload = { amount: 2000 };
      const result = await updateSnapshotOperation('op-1', payload);

      expect(patchMock).toHaveBeenCalledWith('/investments/operations/op-1', payload);
      expect(result).toEqual({ ...mockSnapshot, amount: 2000 });
    });

    it('deletes a snapshot operation', async () => {
      const deleteMock = vi.mocked(api.delete);
      deleteMock.mockResolvedValueOnce({ data: { acknowledged: true, deletedCount: 1 } });

      const result = await deleteOperation('op-1');

      expect(deleteMock).toHaveBeenCalledWith('/investments/operations/op-1');
      expect(result).toEqual({ acknowledged: true, deletedCount: 1 });
    });
  });

  describe('summary', () => {
    it('fetches investment portfolio summary', async () => {
      const mockSummary = {
        totalsByCurrency: {
          USD: {
            currency: 'USD',
            totalCurrentValue: 12500,
            totalNetInvested: 10000,
            totalBought: 10000,
            totalSold: 0,
            totalInterest: 0,
            totalFees: 0,
            totalPnL: 2500,
            roiPercentage: 25,
            instrumentsCount: 1,
          },
        },
        instruments: [
          {
            id: 'inst-1',
            name: 'Apple Inc.',
            kind: 'share' as const,
            currency: 'USD',
            currentValue: 12500,
            netInvested: 10000,
            totalBought: 10000,
            totalSold: 0,
            totalInterest: 0,
            totalFees: 0,
            pnl: 2500,
            roiPercentage: 25,
            lastSnapshotDate: '2026-02-01T00:00:00.000Z',
            operationsCount: 2,
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-02-01T00:00:00.000Z',
          },
        ],
      };

      const getMock = vi.mocked(api.get);
      getMock.mockResolvedValueOnce({ data: mockSummary });

      const { getInvestmentSummary } = await import('./index');
      const result = await getInvestmentSummary();

      expect(getMock).toHaveBeenCalledWith('/investments/summary');
      expect(result).toEqual(mockSummary);
    });
  });
});
