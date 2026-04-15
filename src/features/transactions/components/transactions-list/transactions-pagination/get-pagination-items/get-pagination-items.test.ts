import { describe, expect, it } from 'vitest';

import { getPaginationItems } from './get-pagination-items';

describe('getPaginationItems', () => {
  it('returns empty items when there are no pages', () => {
    expect(getPaginationItems(1, 0)).toEqual([]);
  });

  it('matches the wide middle-page example', () => {
    expect(getPaginationItems(27, 123)).toEqual([
      1,
      'ellipsis',
      25,
      26,
      27,
      28,
      29,
      'ellipsis',
      123,
    ]);
  });

  it('matches the near-start example', () => {
    expect(getPaginationItems(3, 8)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 8]);
  });

  it('supports tighter mobile pagination ranges', () => {
    expect(getPaginationItems(27, 123, 1)).toEqual([
      1,
      'ellipsis',
      26,
      27,
      28,
      'ellipsis',
      123,
    ]);
  });

  it('fills a single-page gap instead of rendering ellipsis', () => {
    expect(getPaginationItems(4, 6)).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
