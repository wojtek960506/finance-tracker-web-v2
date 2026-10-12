import { Landmark, Plus, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Card } from '@shared/ui';

export const NetWorthEmptyState = () => {
  const { t } = useTranslation('net-worth');
  const navigate = useNavigate();

  return (
    <Card
      className="flex flex-col items-center justify-center gap-3 p-8 text-center sm:p-12"
      data-testid="net-worth-empty-state"
    >
      <div className="rounded-full bg-muted/60 p-3 text-text-muted">
        <Wallet className="size-6 text-primary" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">{t('emptyTitle')}</h3>
        <p className="max-w-md text-sm text-text-muted">{t('emptyDescription')}</p>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <Button
          variant="primary"
          onClick={() => navigate('/transactions/new/standard')}
          className="gap-1.5"
        >
          <Plus className="size-4" />
          <span>Add Transaction</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/investments/portfolio')}
          className="gap-1.5"
        >
          <Landmark className="size-4" />
          <span>Investments</span>
        </Button>
      </div>
    </Card>
  );
};
