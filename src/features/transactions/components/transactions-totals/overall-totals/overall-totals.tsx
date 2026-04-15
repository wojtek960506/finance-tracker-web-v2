import { useTranslation } from "react-i18next";

import type { TransactionTotalsOverall } from "@transactions/api";
import { Card } from "@ui";

export const OverallTotals = ({ overall }: { overall: TransactionTotalsOverall }) => {
  const { t } = useTranslation('transactions');

  return (
    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3">
      <Card className="gap-1 rounded-2xl border-fg/15 bg-bg/55 shadow-none">
        <span className="text-sm text-text-muted">{t('totalItems')}</span>
        <strong className="text-2xl font-semibold">
          {overall.totalItems}
        </strong>
      </Card>
      <Card className="gap-1 rounded-2xl border-destructive-border bg-destructive/8 shadow-none">
        <span className="text-sm text-destructive/80">{t('expenseItems')}</span>
        <strong className="text-2xl font-semibold text-destructive">
          {overall.expense.totalItems}
        </strong>
      </Card>
      <Card className="gap-1 rounded-2xl border-bt-primary/25 bg-bt-primary/8 shadow-none">
        <span className="text-sm text-bt-primary/80">{t('incomeItems')}</span>
        <strong className="text-2xl font-semibold text-bt-primary">
          {overall.income.totalItems}
        </strong>
      </Card>
    </div>
  );
}
