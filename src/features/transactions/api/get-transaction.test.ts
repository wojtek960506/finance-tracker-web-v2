import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import { getTransaction } from './get-transaction';

vi.mock('@shared/api', () => ({
  api: { get: vi.fn() },
}));

const id = 'some id';
const mockResult = { id };

describe('getTransaction', () => {
  it('get transaction info', async () => {
    const getMock = vi.mocked(api.get);
    getMock.mockResolvedValueOnce({ data: mockResult });

    const result = await getTransaction(id);

    expect(getMock).toHaveBeenCalledWith(`/transactions/${id}`);
    expect(result).toEqual(mockResult);
  });
});
