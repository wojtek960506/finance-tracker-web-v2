import { describe, expect, it } from 'vitest';

import {
  formatCostPerKm,
  formatDate,
  formatDeltaKm,
  formatKm,
  formatLiters,
  formatPln,
  formatUnitPrice,
} from './utils';

describe('vehicles utils', () => {
  describe('formatters', () => {
    it('formats PLN currency amounts', () => {
      expect(formatPln(1234.5, 'en')).toBe('1,234.50 PLN');
    });

    it('formats km values', () => {
      expect(formatKm(150000, 'en')).toBe('150,000 km');
      expect(formatKm(null)).toBe('-');
      expect(formatKm(undefined)).toBe('-');
    });

    it('formats liters', () => {
      expect(formatLiters(45.678, 'en')).toBe('45.68 L');
    });

    it('formats cost per km', () => {
      expect(formatCostPerKm(0.456, 'en')).toBe('0.46 PLN/km');
      expect(formatCostPerKm(null)).toBe('-');
    });

    it('formats dates', () => {
      expect(formatDate('2026-05-15T12:00:00Z', 'en')).toBe('May 15, 2026');
      expect(formatDate('')).toBe('-');
    });

    it('formats unit price', () => {
      expect(formatUnitPrice(6.456, 'en')).toBe('6.46 PLN/L');
      expect(formatUnitPrice(null)).toBe('-');
    });

    it('formats delta km', () => {
      expect(formatDeltaKm(650, 'en')).toBe('+650 km');
      expect(formatDeltaKm(null)).toBe('-');
    });
  });
});
