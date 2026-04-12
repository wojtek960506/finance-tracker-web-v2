import { describe, expect, it, vi } from 'vitest';

import { createUser } from './create-user';

const postMock = vi.fn();

vi.mock('@shared/api', () => ({
  api: {
    post: (...args: unknown[]) => postMock(...args),
  },
}));

describe('createUser', () => {
  it('creates a user with the provided data', async () => {
    const user = {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };

    postMock.mockResolvedValueOnce({ data: user });

    const result = await createUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'secret',
    });

    expect(postMock).toHaveBeenCalledWith('/users', {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'secret',
    });
    expect(result).toEqual(user);
  });
});
