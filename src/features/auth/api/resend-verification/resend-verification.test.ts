import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import { resendVerification } from './resend-verification';

vi.mock('@shared/api', () => ({
  api: { post: vi.fn() },
}));

describe('resendVerification', () => {
  it('posts the provided email address', async () => {
    const postMock = vi.mocked(api.post);
    postMock.mockResolvedValueOnce({ data: undefined });

    await resendVerification({ email: 'user@example.com' });

    expect(postMock).toHaveBeenCalledWith('/auth/resend-verification', {
      email: 'user@example.com',
    });
  });
});
