import type { TFunction } from 'i18next';
import { describe, expect, it } from 'vitest';

import {
  makeTransaction,
  makeTrashedTransaction,
} from '@test-utils/factories/transaction';
import { EXCHANGE_CATEGORY, TRANSFER_CATEGORY } from '@transactions/consts';

import {
  getReferenceActionMessage,
  hasLinkedTransaction,
} from './transaction-action-copy';

describe('transaction-action-copy', () => {
  const t = (key: string) => `translated:${key}`;

  it('detects whether transaction has a linked reference', () => {
    expect(hasLinkedTransaction(makeTransaction())).toBe(false);
    expect(hasLinkedTransaction(makeTransaction({ refId: 'tx-2' }))).toBe(true);
  });

  it('returns null when there is no linked transaction', () => {
    expect(
      getReferenceActionMessage(
        makeTransaction(),
        'moveToTrash',
        t as TFunction<'transactions', undefined>,
      ),
    ).toBeNull();
  });

  it('returns transfer hint for linked system transfer transaction', () => {
    expect(
      getReferenceActionMessage(
        makeTransaction({
          refId: 'tx-2',
          category: { id: 'cat-transfer', type: 'system', name: TRANSFER_CATEGORY },
        }),
        'restore',
        t as TFunction<'transactions', undefined>,
      ),
    ).toBe('translated:restoreTransferReferenceHint');
  });

  it('returns exchange hint for linked system exchange transaction', () => {
    expect(
      getReferenceActionMessage(
        makeTrashedTransaction({
          refId: 'tx-2',
          category: { id: 'cat-exchange', type: 'system', name: EXCHANGE_CATEGORY },
        }),
        'permanentDelete',
        t as TFunction<'transactions', undefined>,
      ),
    ).toBe('translated:permanentDeleteExchangeReferenceHint');
  });

  it('returns null for linked standard transaction', () => {
    expect(
      getReferenceActionMessage(
        makeTransaction({
          refId: 'tx-2',
          category: { id: 'cat-1', type: 'user', name: 'exchange' },
        }),
        'moveToTrash',
        t as TFunction<'transactions', undefined>,
      ),
    ).toBeNull();
  });
});
