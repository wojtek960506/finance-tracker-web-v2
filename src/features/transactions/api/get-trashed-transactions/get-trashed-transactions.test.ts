import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import { getTrashedTransactions } from './get-trashed-transactions';

vi.mock('@shared/api', () => ({
  api: { get: vi.fn() },
}));

describe('getTrashedTransactions', () => {
  it('gets first trashed page by default', async () => {
    const getMock = vi.mocked(api.get);
    getMock.mockResolvedValueOnce({ data: [{ id: 'tx-1' }] });
    const query = 'page=1&limit=30&sortBy=deletedAt&sortOrder=desc';

    const result = await getTrashedTransactions();

    expect(getMock).toHaveBeenCalledWith(`/transactions/trash?${query}`);
    expect(result).toEqual([{ id: 'tx-1' }]);
  });

  it('gets requested trashed page', async () => {
    const getMock = vi.mocked(api.get);
    getMock.mockResolvedValueOnce({ data: [{ id: 'tx-1' }] });
    const query = 'page=7&limit=30&sortBy=deletedAt&sortOrder=desc';

    await getTrashedTransactions(7);

    expect(getMock).toHaveBeenCalledWith(`/transactions/trash?${query}`);
  });
});
