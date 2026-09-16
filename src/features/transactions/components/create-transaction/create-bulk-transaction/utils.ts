import type { BulkTransactionDTO } from '@transactions/api';
import {
  type ExchangeTransactionFormValues,
  getDefaultExchangeTransactionFormValues,
  getDefaultInvestmentTransactionFormValues,
  getDefaultStandardTransactionFormValues,
  getDefaultTransferTransactionFormValues,
  type InvestmentTransactionFormValues,
  normalizeExchangeTransactionFormValues,
  normalizeInvestmentTransactionFormValues,
  normalizeStandardTransactionFormValues,
  normalizeTransferTransactionFormValues,
  type StandardTransactionFormValues,
  type TransferTransactionFormValues,
} from '@transactions/components/transaction-forms';

import type { BulkTransactionKind, BulkTransactionRowValues } from './types';

export const getBulkStandardTransactionFormValues =
  (): StandardTransactionFormValues => ({
    ...getDefaultStandardTransactionFormValues(),
    date: '',
    transactionType: '' as StandardTransactionFormValues['transactionType'],
  });

export const getBulkTransferTransactionFormValues =
  (): TransferTransactionFormValues => ({
    ...getDefaultTransferTransactionFormValues(),
    date: '',
  });

export const getBulkExchangeTransactionFormValues =
  (): ExchangeTransactionFormValues => ({
    ...getDefaultExchangeTransactionFormValues(),
    date: '',
  });

export const getBulkInvestmentTransactionFormValues =
  (): InvestmentTransactionFormValues => ({
    ...getDefaultInvestmentTransactionFormValues(),
    date: '',
  });

export const getDefaultBulkTransactionRowValues = (): BulkTransactionRowValues => ({
  kind: '',
  standardValues: getBulkStandardTransactionFormValues(),
  transferValues: getBulkTransferTransactionFormValues(),
  exchangeValues: getBulkExchangeTransactionFormValues(),
  investmentValues: getBulkInvestmentTransactionFormValues(),
});

export const getDeleteActionLabel = (index: number) => `delete-row-${index + 1}`;

export const getBulkKindTranslationKey = (kind: BulkTransactionKind) =>
  `bulk${kind.charAt(0).toUpperCase()}${kind.slice(1)}Transaction`;

export const getMeaningfulBulkTransactionRows = (rows: BulkTransactionRowValues[]) =>
  rows.filter((row) => row.kind !== '');

export const getBulkTransactionRowDate = (row: BulkTransactionRowValues) => {
  switch (row.kind) {
    case 'standard':
      return row.standardValues.date;
    case 'transfer':
      return row.transferValues.date;
    case 'exchange':
      return row.exchangeValues.date;
    case 'investment':
      return row.investmentValues.date;
    default:
      return '';
  }
};

export const cloneBulkTransactionRowValues = (
  row: BulkTransactionRowValues,
): BulkTransactionRowValues => ({
  kind: row.kind,
  standardValues: { ...row.standardValues },
  transferValues: { ...row.transferValues },
  exchangeValues: { ...row.exchangeValues },
  investmentValues: { ...row.investmentValues },
});

export const toBulkTransactionDto = (
  row: BulkTransactionRowValues,
): BulkTransactionDTO => {
  switch (row.kind) {
    case 'standard':
      return {
        kind: 'standard',
        ...normalizeStandardTransactionFormValues(row.standardValues),
        amount: Number(row.standardValues.amount),
      };
    case 'transfer':
      return {
        kind: 'transfer',
        ...normalizeTransferTransactionFormValues(row.transferValues),
        amount: Number(row.transferValues.amount),
      };
    case 'exchange':
      return {
        kind: 'exchange',
        ...normalizeExchangeTransactionFormValues(row.exchangeValues),
        amountExpense: Number(row.exchangeValues.amountExpense),
        amountIncome: Number(row.exchangeValues.amountIncome),
      };
    case 'investment':
      return {
        kind: 'investment',
        ...normalizeInvestmentTransactionFormValues(row.investmentValues),
        amount: Number(row.investmentValues.amount),
      };
    default:
      throw new Error(`Unsupported transaction kind: ${row.kind}`);
  }
};
