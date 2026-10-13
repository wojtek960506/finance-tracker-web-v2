import { Fuel, Plus, SearchX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button, Card } from '@shared/ui';

type FuelEmptyStateProps = {
  hasFilters: boolean;
  onAddFirstEntry: () => void;
};

export const FuelEmptyState = ({ hasFilters, onAddFirstEntry }: FuelEmptyStateProps) => {
  const { t } = useTranslation('vehicles');

  if (hasFilters) {
    return (
      <Card
        className="flex flex-col items-center justify-center py-12 text-center"
        data-testid="fuel-empty-matching-filters"
      >
        <div className="flex size-12 items-center justify-center rounded-2xl bg-card-border/20 text-text-muted">
          <SearchX className="size-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-fg">
          {t('fuelPage.empty.noMatching')}
        </h3>
      </Card>
    );
  }

  return (
    <Card
      className="flex flex-col items-center justify-center py-12 text-center"
      data-testid="fuel-empty-state"
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
        <Fuel className="size-6" />
      </div>
      <h3 className="mt-3 text-base font-semibold text-fg">
        {t('fuelPage.empty.title')}
      </h3>
      <p className="mt-1 max-w-sm text-xs text-text-muted">
        {t('fuelPage.empty.description')}
      </p>
      <Button
        variant="primary"
        className="mt-4"
        onClick={onAddFirstEntry}
        data-testid="fuel-empty-create-button"
      >
        <Plus className="size-4" />
        <span>{t('fuelPage.empty.createFirst')}</span>
      </Button>
    </Card>
  );
};
