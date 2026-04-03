import { describe, expect, it, vi } from 'vitest';

import { getNamedResourceErrorToast } from './get-named-resource-error-toast';

describe('getNamedResourceErrorToast', () => {
  it('returns the fallback title and raw api message when the error code is missing', () => {
    const tError = vi.fn();

    expect(
      getNamedResourceErrorToast({
        apiError: {
          message: 'Plain api error message',
        },
        fallbackTitle: 'Fallback title',
        resourceName: 'Groceries',
        tError,
      }),
    ).toEqual({
      title: 'Fallback title',
      message: 'Plain api error message',
    });
    expect(tError).not.toHaveBeenCalled();
  });

  it('returns a title-only toast for already exists errors', () => {
    const tError = vi.fn().mockReturnValue('Category "Groceries" already exists');

    expect(
      getNamedResourceErrorToast({
        apiError: {
          code: 'CATEGORY_ALREADY_EXISTS',
          message: 'Already exists',
        },
        fallbackTitle: 'Fallback title',
        resourceName: 'Groceries',
        tError,
      }),
    ).toEqual({
      title: 'Category "Groceries" already exists',
    });
    expect(tError).toHaveBeenCalledWith('CATEGORY_ALREADY_EXISTS', {
      resourceName: 'Groceries',
    });
  });

  it('returns the fallback title with a translated message for other coded errors', () => {
    const tError = vi.fn().mockReturnValue('Translated dependency error');

    expect(
      getNamedResourceErrorToast({
        apiError: {
          code: 'CATEGORY_DEPENDENCY_ERROR',
          message: 'Dependency error',
        },
        fallbackTitle: 'Fallback title',
        resourceName: 'Groceries',
        tError,
      }),
    ).toEqual({
      title: 'Fallback title',
      message: 'Translated dependency error',
    });
    expect(tError).toHaveBeenCalledWith('CATEGORY_DEPENDENCY_ERROR', {
      resourceName: 'Groceries',
    });
  });
});
