import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';

import { BASE_URL } from '@shared/consts';

import { logout } from './logout';

vi.mock('axios', () => ({
  default: { post: vi.fn() },
}));

describe('logout', () => {
  it('posts to the logout endpoint', async () => {
    const postMock = vi.mocked(axios.post);
    postMock.mockResolvedValueOnce(undefined);

    const result = await logout();

    expect(postMock).toHaveBeenCalledWith(
      `${BASE_URL}/api/auth/logout`,
      {},
      {
        withCredentials: true,
      },
    );
    expect(result).toBeUndefined();
  });
});
