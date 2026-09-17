import { InstrumentsList } from '../instruments';
import { InvestmentsLayout } from '../investments-layout';

export const InvestmentsPage = () => {
  return (
    <InvestmentsLayout>
      <InstrumentsList />
    </InvestmentsLayout>
  );
};
