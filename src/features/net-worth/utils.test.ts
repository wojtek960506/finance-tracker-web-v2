import { describe, expect, it } from 'vitest';

import {
  formatCurrencyAmount,
  formatDecimal,
  formatHorizonYearsAndMonths,
  formatPercentage,
} from './utils';

describe('net-worth utils', () => {
  describe('formatHorizonYearsAndMonths', () => {
    // Mock translation function simulating plural forms
    const mockT = (key: string, options?: Record<string, unknown>) => {
      const count = (options?.count as number) ?? 0;
      if (key === 'years') {
        return count === 1 ? '1 year' : `${count} years`;
      }
      if (key === 'months') {
        return count === 1 ? '1 month' : `${count} months`;
      }
      return key;
    };

    it('formats multiple years and months correctly', () => {
      expect(formatHorizonYearsAndMonths(42.04, mockT)).toBe('3 years 6 months');
      expect(formatHorizonYearsAndMonths(16.58, mockT)).toBe('1 year 5 months');
    });

    it('formats exact years without remaining months', () => {
      expect(formatHorizonYearsAndMonths(12, mockT)).toBe('1 year');
      expect(formatHorizonYearsAndMonths(24, mockT)).toBe('2 years');
      expect(formatHorizonYearsAndMonths(36, mockT)).toBe('3 years');
    });

    it('formats months only when less than a year', () => {
      expect(formatHorizonYearsAndMonths(1, mockT)).toBe('1 month');
      expect(formatHorizonYearsAndMonths(6, mockT)).toBe('6 months');
      expect(formatHorizonYearsAndMonths(11, mockT)).toBe('11 months');
      expect(formatHorizonYearsAndMonths(0, mockT)).toBe('0 months');
    });
  });

  describe('formatDecimal', () => {
    it('formats decimal numbers with 2 fraction digits', () => {
      expect(formatDecimal(42.04, 'en-US')).toBe('42.04');
    });
  });

  describe('formatCurrencyAmount', () => {
    it('formats currency with currency symbol / code', () => {
      expect(formatCurrencyAmount(1234.5, 'PLN', 'en-US')).toBe('1,234.50 PLN');
    });
  });

  describe('formatPercentage', () => {
    it('formats percentage with minimum 1 fraction digit', () => {
      expect(formatPercentage(50, 'en-US')).toBe('50.0');
      expect(formatPercentage(50.25, 'en-US')).toBe('50.25');
    });
  });
});
