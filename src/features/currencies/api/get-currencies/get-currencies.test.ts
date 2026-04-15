import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import { getCurrencies } from './get-currencies';

vi.mock('@shared/api', () => ({
  api: { get: vi.fn() },
}));

describe('getCurrencies', () => {
  it('loads currencies from the api', async () => {
    const response = [{ code: 'USD', name: 'US Dollar' }];
    vi.mocked(api.get).mockResolvedValueOnce({ data: response });

    const result = await getCurrencies();

    expect(api.get).toHaveBeenCalledWith('/currencies');
    expect(result).toEqual(response);
  });
});
