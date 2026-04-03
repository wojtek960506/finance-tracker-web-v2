import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import {
  createNamedResource,
  deleteNamedResource,
  getNamedResource,
  getNamedResources,
  updateNamedResource,
} from './index';

vi.mock('@shared/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const category = {
  id: 'category-1',
  name: 'Groceries',
  ownerId: 'user-1',
  type: 'user' as const,
  nameNormalized: 'groceries',
};

describe('named resources api', () => {
  it('creates a named resource', async () => {
    const postMock = vi.mocked(api.post);
    postMock.mockResolvedValueOnce({ data: category });

    const result = await createNamedResource('categories', 'Groceries');

    expect(postMock).toHaveBeenCalledWith('/categories', { name: 'Groceries' });
    expect(result).toEqual(category);
  });

  it('gets a single named resource', async () => {
    const getMock = vi.mocked(api.get);
    getMock.mockResolvedValueOnce({ data: category });

    const result = await getNamedResource('categories');

    expect(getMock).toHaveBeenCalledWith('/categories');
    expect(result).toEqual(category);
  });

  it('gets named resources list', async () => {
    const getMock = vi.mocked(api.get);
    getMock.mockResolvedValueOnce({ data: [category] });

    const result = await getNamedResources('categories');

    expect(getMock).toHaveBeenCalledWith('/categories');
    expect(result).toEqual([category]);
  });

  it('updates a named resource', async () => {
    const putMock = vi.mocked(api.put);
    putMock.mockResolvedValueOnce({ data: category });

    const result = await updateNamedResource('categories', 'category-1', 'Groceries');

    expect(putMock).toHaveBeenCalledWith('/categories/category-1', {
      name: 'Groceries',
    });
    expect(result).toEqual(category);
  });

  it('deletes a named resource', async () => {
    const deleteMock = vi.mocked(api.delete);
    const response = { acknowledged: true, deletedCount: 1 };
    deleteMock.mockResolvedValueOnce({ data: response });

    const result = await deleteNamedResource('categories', 'category-1');

    expect(deleteMock).toHaveBeenCalledWith('/categories/category-1');
    expect(result).toEqual(response);
  });
});
