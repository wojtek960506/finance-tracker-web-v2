import { describe, expect, it } from 'vitest';

import {
  getTransactionTypeSelectItemClassName,
  getTransactionTypeSelectValueClassName,
} from './transaction-type-select-item-class-name';

describe('getTransactionTypeSelectItemClassName', () => {
  it('returns transaction-type-colored select item classes', () => {
    expect(getTransactionTypeSelectItemClassName('expense')).toContain('text-destructive');
    expect(getTransactionTypeSelectItemClassName('expense')).toContain(
      'data-[state=checked]:!bg-destructive/15',
    );
    expect(getTransactionTypeSelectItemClassName('income')).toContain('text-bt-primary');
    expect(getTransactionTypeSelectItemClassName('income')).toContain(
      'data-[state=checked]:!bg-bt-primary/15',
    );
  });

  it('returns transaction-type-colored selected value classes', () => {
    expect(getTransactionTypeSelectValueClassName('expense')).toBe('text-destructive');
    expect(getTransactionTypeSelectValueClassName('income')).toBe('text-bt-primary');
    expect(getTransactionTypeSelectValueClassName('')).toBe('');
  });
});
