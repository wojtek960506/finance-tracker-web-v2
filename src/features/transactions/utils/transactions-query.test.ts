import { describe, expect, it } from 'vitest';

import {
  buildTransactionsApiSearchParams,
  buildTransactionsRouteSearchParams,
  countActiveTransactionFilters,
  parseTransactionsRouteSearchParams,
} from './transactions-query';

describe('transactions-query helpers', () => {
  it('parses page and supported filters from route search params', () => {
    const searchParams = new URLSearchParams(
      'page=3&startDate=2024-01-01&endDate=2024-01-31&minAmount=10&maxAmount=20&transactionType=expense&currency=USD&excludeCategoryIds=cat-1,cat-2&paymentMethodId=pm-1&accountId=acc-1',
    );

    expect(parseTransactionsRouteSearchParams(searchParams)).toEqual({
      page: 3,
      filters: {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        minAmount: 10,
        maxAmount: 20,
        transactionType: 'expense',
        currency: 'USD',
        excludeCategoryIds: ['cat-1', 'cat-2'],
        paymentMethodId: 'pm-1',
        accountId: 'acc-1',
      },
    });
  });

  it('builds compact route params without default page', () => {
    const searchParams = buildTransactionsRouteSearchParams({
      page: 1,
      filters: {
        categoryId: 'cat-1',
        currency: 'EUR',
      },
    });

    expect(searchParams.toString()).toBe('currency=EUR&categoryId=cat-1');
  });

  it('builds api params with defaults and excludes categories', () => {
    const searchParams = buildTransactionsApiSearchParams({
      page: 2,
      filters: {
        excludeCategoryIds: ['cat-1', 'cat-2'],
      },
    });

    expect(searchParams.toString()).toBe(
      'page=2&limit=30&sortBy=date&sortOrder=desc&excludeCategoryIds=cat-1%2Ccat-2',
    );
  });

  it('counts active filters by field', () => {
    expect(
      countActiveTransactionFilters({
        startDate: '2024-01-01',
        excludeCategoryIds: ['cat-1', 'cat-2'],
        transactionType: 'expense',
      }),
    ).toBe(3);
  });
});
