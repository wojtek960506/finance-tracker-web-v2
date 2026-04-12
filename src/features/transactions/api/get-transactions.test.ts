import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import { getTransactions } from './get-transactions';

vi.mock('@shared/api', () => ({
  api: { get: vi.fn() },
}));

const id = 'some id';
const mockResult = [{ id }];

describe('getTransactions', () => {
  it('gets first page by default', async () => {
    const getMock = vi.mocked(api.get);
    getMock.mockResolvedValueOnce({ data: mockResult });
    const query = 'page=1&limit=30&sortBy=date&sortOrder=desc';

    const result = await getTransactions();

    expect(getMock).toHaveBeenCalledWith(`/transactions?${query}`);
    expect(result).toEqual(mockResult);
  });

  it('gets requested page', async () => {
    const getMock = vi.mocked(api.get);
    getMock.mockResolvedValueOnce({ data: mockResult });
    const query = 'page=4&limit=30&sortBy=date&sortOrder=desc';

    await getTransactions(4);

    expect(getMock).toHaveBeenCalledWith(`/transactions?${query}`);
  });
});
