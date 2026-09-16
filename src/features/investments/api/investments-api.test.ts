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

    it('deletes a snapshot operation', async () => {
      const deleteMock = vi.mocked(api.delete);
      deleteMock.mockResolvedValueOnce({ data: { acknowledged: true, deletedCount: 1 } });

      const result = await deleteOperation('op-1');

      expect(deleteMock).toHaveBeenCalledWith('/investments/operations/op-1');
      expect(result).toEqual({ acknowledged: true, deletedCount: 1 });
    });
  });
});
