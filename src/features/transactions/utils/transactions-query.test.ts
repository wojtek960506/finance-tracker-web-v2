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
      'page=3&startDate=2024-01-01&endDate=2024-01-31&minAmount=10&maxAmount=20&transactionType=expense&currency=USD&categoryIds=cat-3,cat-4&excludeCategoryIds=cat-1,cat-2&paymentMethodIds=pm-1&excludePaymentMethodIds=pm-2,pm-3&accountIds=acc-1&excludeAccountIds=acc-2,acc-3',
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
        categoryIds: ['cat-3', 'cat-4'],
        excludeCategoryIds: ['cat-1', 'cat-2'],
        paymentMethodIds: ['pm-1'],
        excludePaymentMethodIds: ['pm-2', 'pm-3'],
        accountIds: ['acc-1'],
        excludeAccountIds: ['acc-2', 'acc-3'],
      },
    });
  });

  it('builds compact route params without default page', () => {
    const searchParams = buildTransactionsRouteSearchParams({
      page: 1,
      filters: {
        categoryIds: ['cat-1', 'cat-2'],
        currency: 'EUR',
      },
    });

    expect(searchParams.toString()).toBe('currency=EUR&categoryIds=cat-1%2Ccat-2');
  });

  it('builds api params with defaults and multi-value resource filters', () => {
    const searchParams = buildTransactionsApiSearchParams({
      page: 2,
      filters: {
        categoryIds: ['cat-5'],
        excludeCategoryIds: ['cat-1', 'cat-2'],
        paymentMethodIds: ['pm-1'],
        excludePaymentMethodIds: ['pm-2'],
        accountIds: ['acc-1'],
        excludeAccountIds: ['acc-2'],
      },
    });

    expect(searchParams.toString()).toBe(
      'page=2&limit=30&sortBy=date&sortOrder=desc&categoryIds=cat-5&excludeCategoryIds=cat-1%2Ccat-2&paymentMethodIds=pm-1&excludePaymentMethodIds=pm-2&accountIds=acc-1&excludeAccountIds=acc-2',
    );
  });

  it('counts active filters by field', () => {
    expect(
      countActiveTransactionFilters({
        startDate: '2024-01-01',
        excludeCategoryIds: ['cat-1', 'cat-2'],
        paymentMethodIds: ['pm-1'],
        transactionType: 'expense',
      }),
    ).toBe(4);
  });
});
