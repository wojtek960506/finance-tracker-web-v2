import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import { verifyEmail } from './verify-email';

vi.mock('@shared/api', () => ({
  api: { post: vi.fn() },
}));

describe('verifyEmail', () => {
  it('posts the verification token', async () => {
    const postMock = vi.mocked(api.post);
    postMock.mockResolvedValueOnce({ data: undefined });

    await verifyEmail({ token: 'verify-token-123' });

    expect(postMock).toHaveBeenCalledWith('/auth/verify-email', {
      token: 'verify-token-123',
    });
  });
});
