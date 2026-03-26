import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import { logout } from './logout';

vi.mock('@shared/api', () => ({
  api: { post: vi.fn() },
}));

describe('logout', () => {
  it('posts to the logout endpoint', async () => {
    const postMock = vi.mocked(api.post);
    postMock.mockResolvedValueOnce(undefined);

    const result = await logout();

    expect(postMock).toHaveBeenCalledWith('/auth/logout', {});
    expect(result).toBeUndefined();
  });
});
