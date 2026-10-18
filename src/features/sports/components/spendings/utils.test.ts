import { describe, expect, it } from 'vitest';

import type { SportEntry } from '../../api/types';

import { isSportCategory, toSportSpendingTarget } from './utils';

describe('sports spendings utils', () => {
  describe('isSportCategory', () => {
    it('returns true for sports-related category names', () => {
      expect(isSportCategory('Sport')).toBe(true);
      expect(isSportCategory('sport')).toBe(true);
      expect(isSportCategory('SPORTS')).toBe(true);
      expect(isSportCategory('fitness')).toBe(true);
      expect(isSportCategory('siłownia')).toBe(true);
    });

    it('returns false for non-sport categories or empty input', () => {
      expect(isSportCategory(undefined)).toBe(false);
      expect(isSportCategory('')).toBe(false);
      expect(isSportCategory('Transport')).toBe(false);
      expect(isSportCategory('Groceries')).toBe(false);
    });
  });

  describe('toSportSpendingTarget', () => {
    it('maps SportEntry correctly to SportSpendingTarget', () => {
      const entry: SportEntry = {
        id: 'entry-1',
        costPln: 180,
        date: '2026-10-15T10:00:00.000Z',
        itemName: 'Running Shoes',
        category: {
          id: 'cat-1',
          name: 'Running',
          type: 'user',
        },
        categoryId: 'cat-1',
        transactionId: 'tx-123',
        createdAt: '2026-10-15T10:00:00.000Z',
        updatedAt: '2026-10-15T10:00:00.000Z',
        ownerId: 'u-1',
      };

      const target = toSportSpendingTarget(entry);

      expect(target).toEqual({
        id: 'entry-1',
        costPln: 180,
        date: '2026-10-15T10:00:00.000Z',
        itemName: 'Running Shoes',
        categoryId: 'cat-1',
        categoryName: 'Running',
        transactionId: 'tx-123',
      });
    });
  });
});
