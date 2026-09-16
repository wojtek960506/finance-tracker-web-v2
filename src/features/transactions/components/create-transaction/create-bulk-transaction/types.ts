import type {
  ExchangeTransactionFormValues,
  InvestmentTransactionFormValues,
  StandardTransactionFormValues,
  TransferTransactionFormValues,
} from '@transactions/components/transaction-forms';

export type BulkTransactionKind = 'standard' | 'transfer' | 'exchange' | 'investment';
export type BulkTransactionKindValue = BulkTransactionKind | '';

export type BulkTransactionRowValues = {
  kind: BulkTransactionKindValue;
  standardValues: StandardTransactionFormValues;
  transferValues: TransferTransactionFormValues;
  exchangeValues: ExchangeTransactionFormValues;
  investmentValues: InvestmentTransactionFormValues;
};

export type BulkTransactionFormValues = {
  rows: BulkTransactionRowValues[];
};
