import { describe, expect, it } from 'vitest';

import {
  getTransactionTypeButtonClassName,
  getTransactionTypeButtonVariant,
} from './transaction-type-button-variant';

describe('getTransactionTypeButtonVariant', () => {
  it('returns outline when inactive', () => {
    expect(getTransactionTypeButtonVariant('expense', false)).toBe('outline');
    expect(getTransactionTypeButtonVariant('income', false)).toBe('outline');
  });

  it('returns destructive for active expense and primary for active income', () => {
    expect(getTransactionTypeButtonVariant('expense', true)).toBe('destructive');
    expect(getTransactionTypeButtonVariant('income', true)).toBe('primary');
  });

  it('returns a muted inactive color class for each type', () => {
    expect(getTransactionTypeButtonClassName('expense', false)).toBe('text-destructive');
    expect(getTransactionTypeButtonClassName('income', false)).toBe('text-bt-primary');
    expect(getTransactionTypeButtonClassName('expense', true)).toBe('');
  });
});
