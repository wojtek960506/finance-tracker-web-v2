import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import { getTrashedTransaction } from './get-trashed-transaction';

vi.mock('@shared/api', () => ({
  api: { get: vi.fn() },
}));

describe('getTrashedTransaction', () => {
  it('gets trashed transaction details', async () => {
    const getMock = vi.mocked(api.get);
    getMock.mockResolvedValueOnce({ data: { id: 'tx-1' } });

    const result = await getTrashedTransaction('tx-1');

    expect(getMock).toHaveBeenCalledWith('/transactions/trash/tx-1');
    expect(result).toEqual({ id: 'tx-1' });
  });
});
