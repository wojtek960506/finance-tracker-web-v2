import type {
  ExcludedCategoryItemDTO,
  NetWorthIndependenceCapitalDTO,
  NetWorthIndependenceMonthlyAveragesDTO,
} from '../api';

import { CapitalStructure } from './capital-structure';
import { MonthlyCashflowDynamics } from './monthly-cashflow-dynamics';

export type NetWorthIndependenceBreakdownProps = {
  monthlyAverages: NetWorthIndependenceMonthlyAveragesDTO;
  netWorth: NetWorthIndependenceCapitalDTO;
  excludedCategories: ExcludedCategoryItemDTO[];
  baseCurrency?: string;
};

export const NetWorthIndependenceBreakdown = ({
  monthlyAverages,
  netWorth,
  excludedCategories,
  baseCurrency,
}: NetWorthIndependenceBreakdownProps) => {
  return (
    <div
      className="grid grid-cols-1 gap-3 lg:grid-cols-2"
      data-testid="net-worth-independence-breakdown"
    >
      <MonthlyCashflowDynamics
        monthlyAverages={monthlyAverages}
        excludedCategories={excludedCategories}
        baseCurrency={baseCurrency}
      />
      <CapitalStructure netWorth={netWorth} baseCurrency={baseCurrency} />
    </div>
  );
};
