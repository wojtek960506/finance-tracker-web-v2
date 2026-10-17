import { describe, expect, it } from 'vitest';

import { formatDateOnly, getDateWindow, isTransportCategory } from './utils';

describe('spendings utils', () => {
  describe('formatDateOnly', () => {
    it('extracts YYYY-MM-DD from ISO string', () => {
      expect(formatDateOnly('2026-10-15T14:30:00.000Z')).toBe('2026-10-15');
      expect(formatDateOnly('2026-05-01')).toBe('2026-05-01');
      expect(formatDateOnly('')).toBe('');
    });
  });

  describe('getDateWindow', () => {
    it('computes +/- N days range around a given date', () => {
      const windowRange = getDateWindow('2026-10-10T00:00:00.000Z', 3);
      expect(windowRange.startDate).toBe('2026-10-07');
      expect(windowRange.endDate).toBe('2026-10-13');
    });

    it('handles invalid date string gracefully', () => {
      const windowRange = getDateWindow('invalid-date');
      expect(windowRange.startDate).toBe('invalid-date');
      expect(windowRange.endDate).toBe('invalid-date');
    });
  });

  describe('isTransportCategory', () => {
    it('returns true for transport-related category names', () => {
      expect(isTransportCategory('Transport')).toBe(true);
      expect(isTransportCategory('transportation')).toBe(true);
      expect(isTransportCategory('Motoryzacja')).toBe(true);
      expect(isTransportCategory('Auto')).toBe(true);
      expect(isTransportCategory('Komunikacja')).toBe(true);
    });

    it('returns false for non-transport category names or empty', () => {
      expect(isTransportCategory('Groceries')).toBe(false);
      expect(isTransportCategory('Entertainment')).toBe(false);
      expect(isTransportCategory(undefined)).toBe(false);
      expect(isTransportCategory('')).toBe(false);
    });
  });
});
