import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import {
  createSportCategory,
  createSportEntry,
  deleteSportCategory,
  deleteSportEntry,
  favoriteSportCategory,
  getFavoriteSportCategories,
  getSportCategories,
  getSportCategory,
  getSportEntries,
  getSportEntry,
  getSportStats,
  linkSportSpendings,
  type SportCategory,
  type SportEntry,
  type SportEntryListResponse,
  type SportStatsResponse,
  unfavoriteSportCategory,
  unlinkSportSpending,
  updateSportCategory,
  updateSportEntry,
} from './index';

vi.mock('@shared/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockCategory: SportCategory = {
  id: 'cat-1',
  name: 'Rower',
  nameNormalized: 'rower',
  type: 'user',
  isFavorite: false,
};

const mockEntry: SportEntry = {
  id: 'entry-1',
  ownerId: 'user-1',
  categoryId: 'cat-1',
  category: { id: 'cat-1', name: 'Rower', type: 'user' },
  date: '2026-05-10T00:00:00.000Z',
  itemName: 'Kask',
  costPln: 250,
  description: null,
  transactionId: null,
  createdAt: '2026-05-10T00:00:00.000Z',
  updatedAt: '2026-05-10T00:00:00.000Z',
};

const mockListResponse: SportEntryListResponse = {
  items: [mockEntry],
  pagination: {
    total: 1,
    page: 1,
    limit: 50,
    totalPages: 1,
  },
};

const mockStats: SportStatsResponse = {
  totalCostPln: 250,
  totalEntries: 1,
  byCategory: [
    {
      categoryId: 'cat-1',
      categoryName: 'Rower',
      type: 'user',
      totalCostPln: 250,
      entryCount: 1,
      percentage: 100,
    },
  ],
  byYear: [{ year: 2026, totalCostPln: 250, entryCount: 1 }],
  byMonth: [{ year: 2026, month: 5, totalCostPln: 250, entryCount: 1 }],
};

describe('Sports API', () => {
  describe('Sport Entries', () => {
    it('getSportEntries fetches list of entries with filters', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: mockListResponse });

      const filters = { categoryId: 'cat-1', page: 1, limit: 50 };
      const res = await getSportEntries(filters);

      expect(api.get).toHaveBeenCalledWith('/sports', { params: filters });
      expect(res).toEqual(mockListResponse);
    });

    it('getSportEntry fetches single entry by id', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: mockEntry });

      const res = await getSportEntry('entry-1');

      expect(api.get).toHaveBeenCalledWith('/sports/entry-1');
      expect(res).toEqual(mockEntry);
    });

    it('createSportEntry sends POST to /sports', async () => {
      vi.mocked(api.post).mockResolvedValueOnce({ data: mockEntry });

      const payload = {
        categoryId: 'cat-1',
        date: '2026-05-10',
        itemName: 'Kask',
        costPln: 250,
      };
      const res = await createSportEntry(payload);

      expect(api.post).toHaveBeenCalledWith('/sports', payload);
      expect(res).toEqual(mockEntry);
    });

    it('updateSportEntry sends PATCH to /sports/:id', async () => {
      vi.mocked(api.patch).mockResolvedValueOnce({ data: mockEntry });

      const payload = { costPln: 280 };
      const res = await updateSportEntry('entry-1', payload);

      expect(api.patch).toHaveBeenCalledWith('/sports/entry-1', payload);
      expect(res).toEqual(mockEntry);
    });

    it('deleteSportEntry sends DELETE to /sports/:id', async () => {
      vi.mocked(api.delete).mockResolvedValueOnce({ data: undefined });

      await deleteSportEntry('entry-1');

      expect(api.delete).toHaveBeenCalledWith('/sports/entry-1');
    });
  });

  describe('Sport Categories', () => {
    it('getSportCategories fetches all categories', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: [mockCategory] });

      const res = await getSportCategories();

      expect(api.get).toHaveBeenCalledWith('/sports/categories');
      expect(res).toEqual([mockCategory]);
    });

    it('getFavoriteSportCategories fetches favorites', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: [mockCategory] });

      const res = await getFavoriteSportCategories();

      expect(api.get).toHaveBeenCalledWith('/sports/categories/favorites');
      expect(res).toEqual([mockCategory]);
    });

    it('getSportCategory fetches category by id', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: mockCategory });

      const res = await getSportCategory('cat-1');

      expect(api.get).toHaveBeenCalledWith('/sports/categories/cat-1');
      expect(res).toEqual(mockCategory);
    });

    it('createSportCategory sends POST to /sports/categories', async () => {
      vi.mocked(api.post).mockResolvedValueOnce({ data: mockCategory });

      const res = await createSportCategory({ name: 'Rower' });

      expect(api.post).toHaveBeenCalledWith('/sports/categories', {
        name: 'Rower',
      });
      expect(res).toEqual(mockCategory);
    });

    it('updateSportCategory sends PATCH to /sports/categories/:id', async () => {
      vi.mocked(api.patch).mockResolvedValueOnce({ data: mockCategory });

      const res = await updateSportCategory('cat-1', { name: 'Kolarstwo' });

      expect(api.patch).toHaveBeenCalledWith('/sports/categories/cat-1', {
        name: 'Kolarstwo',
      });
      expect(res).toEqual(mockCategory);
    });

    it('deleteSportCategory sends DELETE to /sports/categories/:id', async () => {
      vi.mocked(api.delete).mockResolvedValueOnce({ data: undefined });

      await deleteSportCategory('cat-1');

      expect(api.delete).toHaveBeenCalledWith('/sports/categories/cat-1');
    });

    it('favoriteSportCategory sends POST to /sports/categories/:id/favorite', async () => {
      vi.mocked(api.post).mockResolvedValueOnce({ data: mockCategory });

      const res = await favoriteSportCategory('cat-1');

      expect(api.post).toHaveBeenCalledWith('/sports/categories/cat-1/favorite');
      expect(res).toEqual(mockCategory);
    });

    it('unfavoriteSportCategory sends DELETE to /sports/categories/:id/unfavorite', async () => {
      vi.mocked(api.delete).mockResolvedValueOnce({ data: mockCategory });

      const res = await unfavoriteSportCategory('cat-1');

      expect(api.delete).toHaveBeenCalledWith('/sports/categories/cat-1/unfavorite');
      expect(res).toEqual(mockCategory);
    });
  });

  describe('Sport Stats', () => {
    it('getSportStats sends GET to /sports/stats with query', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: mockStats });

      const res = await getSportStats({ year: 2026 });

      expect(api.get).toHaveBeenCalledWith('/sports/stats', {
        params: { year: 2026 },
      });
      expect(res).toEqual(mockStats);
    });
  });

  describe('Sport Spendings Linking', () => {
    it('linkSportSpendings sends POST to /sports/spendings/link', async () => {
      const mockLinkResponse = { acknowledged: true, modifiedCount: 2 };
      vi.mocked(api.post).mockResolvedValueOnce({ data: mockLinkResponse });

      const payload = {
        transactionId: 'tx-1',
        entryIds: ['entry-1', 'entry-2'],
      };
      const res = await linkSportSpendings(payload);

      expect(api.post).toHaveBeenCalledWith('/sports/spendings/link', payload);
      expect(res).toEqual(mockLinkResponse);
    });

    it('unlinkSportSpending sends POST to /sports/spendings/unlink', async () => {
      const mockUnlinkResponse = { acknowledged: true, modifiedCount: 1 };
      vi.mocked(api.post).mockResolvedValueOnce({ data: mockUnlinkResponse });

      const payload = { entryId: 'entry-1' };
      const res = await unlinkSportSpending(payload);

      expect(api.post).toHaveBeenCalledWith('/sports/spendings/unlink', payload);
      expect(res).toEqual(mockUnlinkResponse);
    });
  });
});
