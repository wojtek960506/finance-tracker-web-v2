import { describe, expect, it } from 'vitest';

import type { SportEntry, SportStatsCategory } from '../../api';

import { calculateSportCategorySummary } from './utils';

const mockCategory = {
  id: 'cat-1',
  name: 'Gym',
  type: 'system' as const,
};

const createMockEntry = (
  id: string,
  costPln: number,
  transactionId: string | null = null,
): SportEntry => ({
  id,
  ownerId: 'user-1',
  categoryId: 'cat-1',
  category: mockCategory,
  date: '2026-03-15T10:00:00Z',
  itemName: `Item ${id}`,
  costPln,
  transactionId,
  createdAt: '2026-03-15T10:00:00Z',
  updatedAt: '2026-03-15T10:00:00Z',
});

describe('calculateSportCategorySummary', () => {
  it('returns zeros for empty items and null categoryStats', () => {
    const result = calculateSportCategorySummary([]);

    expect(result).toEqual({
      totalCostPln: 0,
      totalEntries: 0,
      linkedCostPln: 0,
      linkedEntriesCount: 0,
      linkedPercentage: 0,
    });
  });

  it('calculates totals and linked spendings from items alone', () => {
    const items: SportEntry[] = [
      createMockEntry('1', 100, 'tx-1'),
      createMockEntry('2', 50, null),
      createMockEntry('3', 150, 'tx-2'),
    ];

    const result = calculateSportCategorySummary(items);

    expect(result).toEqual({
      totalCostPln: 300,
      totalEntries: 3,
      linkedCostPln: 250,
      linkedEntriesCount: 2,
      linkedPercentage: 83, // 250 / 300 = 83.33% -> 83%
    });
  });

  it('prefers categoryStats for total cost and total entries when provided', () => {
    const items: SportEntry[] = [
      createMockEntry('1', 100, 'tx-1'),
      createMockEntry('2', 50, null),
    ];

    const categoryStats: SportStatsCategory = {
      categoryId: 'cat-1',
      categoryName: 'Gym',
      type: 'system',
      totalCostPln: 1000,
      entryCount: 15,
      percentage: 25,
    };

    const result = calculateSportCategorySummary(items, categoryStats);

    expect(result).toEqual({
      totalCostPln: 1000,
      totalEntries: 15,
      linkedCostPln: 100,
      linkedEntriesCount: 1,
      linkedPercentage: 10, // 100 / 1000 = 10%
    });
  });

  it('handles 100% linked items correctly', () => {
    const items: SportEntry[] = [
      createMockEntry('1', 200, 'tx-1'),
      createMockEntry('2', 300, 'tx-2'),
    ];

    const result = calculateSportCategorySummary(items);

    expect(result.linkedPercentage).toBe(100);
    expect(result.linkedEntriesCount).toBe(2);
    expect(result.linkedCostPln).toBe(500);
    expect(result.totalCostPln).toBe(500);
  });
});
