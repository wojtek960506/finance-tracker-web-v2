import { useTranslation } from 'react-i18next';

import { InstrumentKindBadge } from '@features/investments/components/instruments';
import type { TransactionInvestmentDetails } from '@transactions/api';

import { Detail } from '../../detail';

type InvestmentDetailsProps = {
  investment: TransactionInvestmentDetails;
};

export const InvestmentDetails = ({ investment }: InvestmentDetailsProps) => {
  const { t } = useTranslation('transactions');

  return (
    <>
      <Detail title={t('investmentOperationKind')}>
        <span
          className="font-semibold capitalize"
          data-testid="transaction-details-operation-kind"
        >
          {t(`operationKind.${investment.operationKind}`)}
        </span>
      </Detail>
      <Detail title={t('investmentInstrument')}>
        <div
          className="flex items-center gap-2"
          data-testid="transaction-details-instrument"
        >
          <span>{investment.instrument.name}</span>
          <InstrumentKindBadge kind={investment.instrument.kind} />
        </div>
      </Detail>
      {investment.note && (
        <Detail title={t('investmentNote')}>
          <span data-testid="transaction-details-investment-note">{investment.note}</span>
        </Detail>
      )}
    </>
  );
};
