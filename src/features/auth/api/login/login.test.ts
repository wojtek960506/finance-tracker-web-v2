import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import { login } from './login';

vi.mock('@shared/api', () => ({
  api: { post: vi.fn() },
}));

describe('login', () => {
  it('posts credentials and returns the access token', async () => {
    const postMock = vi.mocked(api.post);
    postMock.mockResolvedValueOnce({ data: { accessToken: 'token-123' } });

    const result = await login('user@example.com', 'secret');

    expect(postMock).toHaveBeenCalledWith('/auth/login', {
      email: 'user@example.com',
      password: 'secret',
    });
    expect(result).toBe('token-123');
  });
});
