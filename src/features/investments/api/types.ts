import type { components } from '@shared/types/api.generated';

export type CurrencyCode = components['schemas']['TransactionStandard']['currency'];

export type InvestmentInstrumentKind =
  components['schemas']['InvestmentInstrumentInput']['kind'];

export type InvestmentInstrument = components['schemas']['InvestmentInstrumentResponse'];

export type CreateInstrumentPayload = Omit<
  components['schemas']['InvestmentInstrumentInput'],
  'currency'
> & {
  currency?: CurrencyCode | (string & {});
};

export type UpdateInstrumentPayload = Omit<
  components['schemas']['InvestmentInstrumentUpdateInput'],
  'currency'
> & {
  currency?: CurrencyCode | (string & {});
};

export type InvestmentOperationKind =
  components['schemas']['InvestmentOperationResponse']['kind'];

export type InvestmentOperation = components['schemas']['InvestmentOperationResponse'];

export type InvestmentSnapshotOperation =
  components['schemas']['InvestmentSnapshotOperationResponse'];

export type InvestmentCashFlowOperation =
  components['schemas']['InvestmentCashFlowOperationResponse'];

export type CreateSnapshotPayload = Omit<
  components['schemas']['InvestmentSnapshotOperationInput'],
  'currency'
> & {
  currency: CurrencyCode | (string & {});
};

export type GetInstrumentsQuery = {
  kind?: InvestmentInstrumentKind;
  currency?: string;
  search?: string;
};

export type GetOperationsQuery = {
  instrumentId?: string;
  kind?: InvestmentOperationKind;
  startDate?: string;
  endDate?: string;
};
