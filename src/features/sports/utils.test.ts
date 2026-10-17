import { describe, expect, it } from 'vitest';

import { formatDate, formatPln, getCategoryColor, getCategoryDisplayName } from './utils';

describe('Sports Utilities', () => {
  describe('getCategoryDisplayName', () => {
    it('returns translated key for system category with categoryKey', () => {
      const category = {
        name: 'Inne',
        type: 'system' as const,
        categoryKey: 'other',
      };
      const t = (key: string) => (key === 'categories.other' ? 'Other' : key);

      expect(getCategoryDisplayName(category, t)).toBe('Other');
    });

    it('returns raw category name for user categories', () => {
      const category = {
        name: 'Bieganie',
        type: 'user' as const,
        categoryKey: null,
      };
      const t = (key: string) => key;

      expect(getCategoryDisplayName(category, t)).toBe('Bieganie');
    });

    it('returns raw category name when system category has no categoryKey', () => {
      const category = {
        name: 'Siłownia',
        type: 'system' as const,
        categoryKey: null,
      };
      const t = (key: string) => key;

      expect(getCategoryDisplayName(category, t)).toBe('Siłownia');
    });
  });

  describe('formatPln', () => {
    it('formats numbers into PLN format', () => {
      expect(formatPln(1234.5, 'en')).toBe('1,234.50 PLN');
    });
  });

  describe('formatDate', () => {
    it('formats ISO date strings', () => {
      const formatted = formatDate('2026-05-15T00:00:00.000Z', 'en');
      expect(formatted).toBe('May 15, 2026');
    });

    it('returns dash for empty string', () => {
      expect(formatDate('', 'en')).toBe('-');
    });
  });

  describe('getCategoryColor', () => {
    it('cycles through palette colors deterministically', () => {
      const color0 = getCategoryColor(0);
      const color1 = getCategoryColor(1);
      expect(color0).toBeDefined();
      expect(color1).toBeDefined();
      expect(color0).not.toBe(color1);
    });
  });
});
