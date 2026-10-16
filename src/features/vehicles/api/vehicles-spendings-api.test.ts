import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import { linkSpendings, unlinkSpending } from './index';

vi.mock('@shared/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Vehicles Spendings API', () => {
  it('linkSpendings posts spending links', async () => {
    const payload = {
      transactionId: 'tx-123',
      spendings: [{ spendingType: 'fuel' as const, spendingId: 'fuel-1' }],
    };
    const response = { acknowledged: true, modifiedCount: 1 };
    vi.mocked(api.post).mockResolvedValueOnce({ data: response });

    const result = await linkSpendings(payload);

    expect(api.post).toHaveBeenCalledWith('/vehicles/spendings/link', payload);
    expect(result).toEqual(response);
  });

  it('unlinkSpending posts unlink action', async () => {
    const payload = {
      spendingType: 'fuel' as const,
      spendingId: 'fuel-1',
    };
    const response = { acknowledged: true, modifiedCount: 1 };
    vi.mocked(api.post).mockResolvedValueOnce({ data: response });

    const result = await unlinkSpending(payload);

    expect(api.post).toHaveBeenCalledWith('/vehicles/spendings/unlink', payload);
    expect(result).toEqual(response);
  });
});
