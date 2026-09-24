import { PieChart, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Card } from '@shared/ui';

type PortfolioEmptyStateProps = {
  onCreateInstrument: () => void;
};

export const PortfolioEmptyState = ({ onCreateInstrument }: PortfolioEmptyStateProps) => {
  const { t } = useTranslation('investments');
  const navigate = useNavigate();

  return (
    <Card
      className="flex flex-col items-center justify-center gap-3 p-8 text-center sm:p-12"
      data-testid="portfolio-empty-state"
    >
      <div className="rounded-full bg-muted/60 p-3 text-text-muted">
        <PieChart className="size-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">
          {t('portfolio.emptyTitle')}
        </h3>
        <p className="max-w-md text-sm text-text-muted">
          {t('portfolio.emptyDescription')}
        </p>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <Button variant="primary" onClick={onCreateInstrument} className="gap-1.5">
          <Plus className="size-4" />
          <span>{t('portfolio.addHolding')}</span>
        </Button>
        <Button variant="outline" onClick={() => navigate('/investments/operations')}>
          {t('tabs.operations')}
        </Button>
      </div>
    </Card>
  );
};
